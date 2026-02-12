'use client'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { Project } from './Project.type'
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyProjects } from '../serverFunctions/projects/getMyProjects'
import { createProject } from '../serverFunctions/projects/createProject'

const MyProjectsContext = createContext<{
  isLoading: boolean
  projects?: Project[]
  addProject: UseMutateFunction<Project, Error, Omit<Project, 'id' | 'userId'>, unknown>
  deleteProject: (id: string) => Promise<void>
  updateProjectVisibility: (id: string) => Promise<Project>
}>({
  isLoading: false,
  projects: [],
  addProject: () => Promise.reject(),
  deleteProject: () => Promise.reject(),
  updateProjectVisibility: () => Promise.reject(),
})

export const useMyProjectsContext = () => useContext(MyProjectsContext)

export const MyProjectsContextProvider = ({ children }: PropsWithChildren) => {
  const { data: projects, isLoading } = useQuery({ queryKey: ['my-projects'], queryFn: getMyProjects })
  const queryClient = useQueryClient()

  const { mutate: addProject, isPending } = useMutation<Project, Error, Omit<Project, 'id' | 'userId'>>({
    mutationFn: createProject,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['my-projects'] })
    },
  })

  const value = useMemo(() => {
    return {
      isLoading: isLoading || isPending,
      projects,
      addProject,
      deleteProject: () => Promise.reject('TODO'),
      updateProjectVisibility: () => Promise.reject('TODO'),
    }
  }, [addProject, isLoading, isPending, projects])

  return <MyProjectsContext.Provider value={value}>{children}</MyProjectsContext.Provider>
}
