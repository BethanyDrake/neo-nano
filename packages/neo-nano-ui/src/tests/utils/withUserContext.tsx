import { createHelper } from 'souvlaki';
import { UserContext } from '@/lib/context/UserContext';
import { Profile } from '@/lib/types/forum.types';

// eslint-disable-next-line react/display-name
export const withUserContext = createHelper((profile: Pick<Profile, 'id' | 'role'> | null) => ({ children }) => (
  <UserContext.Provider value={profile}>
    {children}
  </UserContext.Provider>
));