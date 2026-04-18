import { Project } from '@/lib/projects/Project.type'
import camelcaseKeys from 'camelcase-keys'

export const rawProjectToProject = (rawProject: Record<string, unknown>): Project => {
  const project = camelcaseKeys(rawProject)
  const _project: Record<string, unknown> = {
    ...project,
    aspects: {
      romance: project.romanceAspect,
      mystery: project.mysteryAspect,
      thrill: project.thrillAspect,
      complexity: project.complexityAspect,
      fantasy: project.fantasyAspect,
    },
  }

  delete _project.complexityAspect
  delete _project.mysteryAspect
  delete _project.thrillAspect
  delete _project.romanceAspect
  delete _project.fantasyAspect

  return _project as Project
}
