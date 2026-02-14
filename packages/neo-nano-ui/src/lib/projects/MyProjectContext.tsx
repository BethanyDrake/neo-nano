'use client'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { Project } from './Project.type'
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyProjects } from '../serverFunctions/projects/getMyProjects'
import { createProject as _createProject } from '../serverFunctions/projects/createProject'
import { deleteProject as _deleteProject } from '../serverFunctions/projects/deleteProject'
import { updateProject as _updateProject }from '../serverFunctions/projects/updateProject'

const MyProjectsContext = createContext<{
  isLoading: boolean
  projects?: Project[]
  addProject: UseMutateFunction<Project, Error, Omit<Project, 'id' | 'userId'>, unknown>
  isDeleteProjectPending: boolean
  deleteProject: UseMutateFunction<void, Error, string>
  updateProject: UseMutateFunction<Project, Error, Omit<Project, 'userId'>, unknown>
  isAddProjectPending: boolean
  isUpdateProjectPending: boolean
}>({
  isLoading: false,
  projects: [],
  isDeleteProjectPending: false,
  addProject: () => Promise.reject(),
  deleteProject: () => Promise.reject(),
  updateProject: () => Promise.reject(),
  isAddProjectPending: false,
  isUpdateProjectPending: false
})

export const useMyProjectsContext = () => useContext(MyProjectsContext)

export const MyProjectsContextProvider = ({ children }: PropsWithChildren) => {
  const { data: projects, isLoading } = useQuery({ queryKey: ['my-projects'], queryFn: getMyProjects })
  const queryClient = useQueryClient()

  const { mutate: addProject, isPending: isAddProjectPending } = useMutation<Project, Error, Omit<Project, 'id' | 'userId'>>({
    mutationFn: _createProject,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['my-projects'] })
    },
  })

   const { mutate: updateProject, isPending: isUpdateProjectPending } = useMutation<Project, Error, Omit<Project, 'userId'>>({
    mutationFn: _updateProject,
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
      isAddProjectPending,
      deleteProject,
      updateProject,
      isUpdateProjectPending
    }
  }, [isLoading, projects, isDeleteProjectPending, addProject, isAddProjectPending, deleteProject, updateProject, isUpdateProjectPending])

  return <MyProjectsContext.Provider value={value}>{children}</MyProjectsContext.Provider>
}
