import { createHelper } from 'souvlaki';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// eslint-disable-next-line react/display-name
export const withReactQueryClient = createHelper(() => ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
));