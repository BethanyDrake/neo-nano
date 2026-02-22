import { Visibility } from '../types/forum.types'

export type ProjectStatus = 'planning' | 'writing' | 'editing' | 'done'
export type Aspect = 'romance' | 'fantasy' | 'mystery' | 'thrill' | 'complexity'

export type Project = {
  id: string
  title: string
  blurb?: string
  excerpt?: string
  wordCount?: number | null
  userId: string
  visibility: Visibility
  status: ProjectStatus
  aspects: Record<Aspect, number>
}

export const buildProject = (overrides: Partial<Project> = {}): Project => {
  return {
    id: '',
    title: '',
    userId: '',
    visibility: 'private',
    status: 'planning',
    aspects: {
      romance: 0,
      fantasy: 0,
      mystery: 0,
      thrill: 0,
      complexity: 0,
    },
    ...overrides,
  }
}
