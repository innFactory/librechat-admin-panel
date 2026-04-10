import { QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { routeTree } from './routeTree.gen';

function getBasePath(): string {
  if (typeof process !== 'undefined' && process.env?.BASE_PATH) {
    return process.env.BASE_PATH.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && (window as Record<string, unknown>).__BASE_PATH__) {
    return ((window as Record<string, unknown>).__BASE_PATH__ as string).replace(/\/+$/, '');
  }
  return '';
}

export function getRouter() {
  const queryClient = new QueryClient();
  const basepath = getBasePath();
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    ...(basepath ? { basepath } : {}),
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
