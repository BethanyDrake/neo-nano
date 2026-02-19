import { Visibility } from "../types/forum.types"

export type ProjectStatus = 'planning'| 'writing'| 'editing' |'done'
export type Aspect = 'romance' | 'fantasy' | 'mystery' | 'thrill' | 'complexity'


export type Project = {
    id: string,
    title: string,
    blurb?: string,
    excerpt?: string,
    wordCount?: number | null,
    userId: string,
    visibility: Visibility
    status: ProjectStatus
    aspects: Record<Aspect, number>
}
