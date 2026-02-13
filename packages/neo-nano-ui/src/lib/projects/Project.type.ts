import { Visibility } from "../types/forum.types"

export type ProjectStatus = 'planning'| 'writing'| 'editing' |'done'

export type Project = {
    id: string,
    title: string,
    blurb?: string,
    excerpt?: string,
    wordCount?: number,
    userId: string,
    visibility: Visibility
    status: ProjectStatus
}
