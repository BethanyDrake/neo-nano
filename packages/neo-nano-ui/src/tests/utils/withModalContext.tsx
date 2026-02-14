import { createHelper } from 'souvlaki';
import { ModalContextProvider } from '@/lib/modals/ModalContext';

// eslint-disable-next-line react/display-name
export const withModalContext = createHelper(() => ({ children }) => (
  <ModalContextProvider>
    {children}
  </ModalContextProvider>
));