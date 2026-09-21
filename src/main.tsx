import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import { routeTree } from './routeTree.gen'
import { Toaster } from 'react-hot-toast';
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import system from './theme'

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ChakraProvider>
  </StrictMode>,
)