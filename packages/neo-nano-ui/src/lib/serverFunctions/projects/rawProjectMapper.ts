import { Project } from '@/lib/projects/Project.type'
import camelcaseKeys from 'camelcase-keys'

export const rawProjectToProject = (rawProject: Record<string, unknown>): Project => {
  const project = camelcaseKeys(rawProject)

  return {
    ...project,
    aspects: {
      romance: project.romanceAspect,
      mystery: project.mysteryAspect,
      thrill: project.thrillAspect,
      complexity: project.complexityAspect,
      fantasy: project.fantasyAspect,
    },
  } as Project
}
