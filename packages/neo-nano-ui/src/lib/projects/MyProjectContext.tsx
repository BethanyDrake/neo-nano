'use client'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { Project } from './Project.type'
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyProjects } from '../serverFunctions/projects/getMyProjects'
import { createProject as _createProject } from '../serverFunctions/projects/createProject'
import { deleteProject as _deleteProject } from '../serverFunctions/projects/deleteProject'

const MyProjectsContext = createContext<{
  isLoading: boolean
  projects?: Project[]
  addProject: UseMutateFunction<Project, Error, Omit<Project, 'id' | 'userId'>, unknown>
  isDeleteProjectPending: boolean
  deleteProject: UseMutateFunction<void, Error, string>
  updateProjectVisibility: (id: string) => Promise<Project>
}>({
  isLoading: false,
  projects: [],
  isDeleteProjectPending: false,
  addProject: () => Promise.reject(),
  deleteProject: () => Promise.reject(),
  updateProjectVisibility: () => Promise.reject(),
})

export const useMyProjectsContext = () => useContext(MyProjectsContext)

export const MyProjectsContextProvider = ({ children }: PropsWithChildren) => {
  const { data: projects, isLoading } = useQuery({ queryKey: ['my-projects'], queryFn: getMyProjects })
  const queryClient = useQueryClient()

  const { mutate: addProject } = useMutation<Project, Error, Omit<Project, 'id' | 'userId'>>({
    mutationFn: _createProject,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['my-projects'] })
    },
  })

   const { mutate: deleteProject , isPending: isDeleteProjectPending} = useMutation<void, Error, string>({
    mutationFn: _deleteProject,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['my-projects'] })
    },
  })

  const value = useMemo(() => {
    return {
      isLoading,
      projects,
      isDeleteProjectPending,
      addProject,
      deleteProject,
      updateProjectVisibility: () => Promise.reject('TODO'),
    }
  }, [addProject, deleteProject, isLoading, projects, isDeleteProjectPending])

  return <MyProjectsContext.Provider value={value}>{children}</MyProjectsContext.Provider>
}
