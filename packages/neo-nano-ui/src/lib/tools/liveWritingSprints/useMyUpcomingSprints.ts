import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'
import { getMyUpcomingSprints } from '@/lib/serverFunctions/sprints/publicSprint'
import { useQuery } from '@tanstack/react-query'
import {  secondsToMilliseconds } from 'date-fns'

export const useMyUpcomingLiveSprints = () => {
  const isLoggedIn = useIsLoggedIn()
  return useQuery({
    queryKey: ['my-upcoming-live-sprints'],
    staleTime: secondsToMilliseconds(30),
    queryFn: () => getMyUpcomingSprints(),
    enabled: isLoggedIn,
  })
}
