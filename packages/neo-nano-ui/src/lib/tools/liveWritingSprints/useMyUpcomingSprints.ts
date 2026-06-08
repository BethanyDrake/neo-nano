import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'
import { getMyUpcomingSprints } from '@/lib/serverFunctions/sprints/publicSprint'
import { useQuery } from '@tanstack/react-query'

export const useMyUpcomingLiveSprints = () => {
  const isLoggedIn = useIsLoggedIn()
  return useQuery({
    queryKey: ['my-upcoming-live-sprints'],
    queryFn: () => getMyUpcomingSprints(),
    enabled: isLoggedIn,
  })
}
