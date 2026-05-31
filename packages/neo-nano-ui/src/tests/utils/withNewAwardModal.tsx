import { createHelper } from 'souvlaki';
import { NewAwardModalProvider } from '@/lib/awards/NewAwardModal';

// eslint-disable-next-line react/display-name
export const withNewAwardModal = createHelper(() => ({ children }) => (
  <NewAwardModalProvider>
    {children}
  </NewAwardModalProvider>
));