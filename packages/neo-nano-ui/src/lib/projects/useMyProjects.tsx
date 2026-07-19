import { useQuery } from '@tanstack/react-query'
import { getMyProjects } from '../serverFunctions/projects/getMyProjects'

export const useMyProjects = () => {
  const { data: projects, isLoading } = useQuery({ queryKey: ['my-projects'], queryFn: getMyProjects })
  return { projects, isLoading }
}
