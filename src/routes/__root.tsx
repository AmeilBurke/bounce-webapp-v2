import { setupStatusQueryOptions } from '../api-requests/setup/setup.queries';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
}>()({
    beforeLoad: async ({ context, location }) => {
        const isSetupComplete = await context.queryClient.query(
            setupStatusQueryOptions
        );

        if (!isSetupComplete && location.pathname !== '/setup') {
            throw redirect({ to: '/setup' });
        }

        if (isSetupComplete && location.pathname === '/setup') {
            throw redirect({ to: '/' });
        }
    },
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
})