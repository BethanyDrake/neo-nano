import { createHelper } from 'souvlaki';
import { MyProjectsContextProvider } from '@/lib/projects/MyProjectContext';

// eslint-disable-next-line react/display-name
export const withMyProjectContext = createHelper(() => ({ children }) => (
  <MyProjectsContextProvider>
    {children}
  </MyProjectsContextProvider>
));