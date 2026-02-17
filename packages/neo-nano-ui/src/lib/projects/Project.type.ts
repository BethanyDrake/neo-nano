import { Visibility } from "../types/forum.types"

export type ProjectStatus = 'planning'| 'writing'| 'editing' |'done'

export type Project = {
    id: string,
    title: string,
    blurb?: string,
    excerpt?: string,
    wordCount?: number | null,
    userId: string,
    visibility: Visibility
    status: ProjectStatus
    aspects: {
        romance: number,
        fantasy: number,
        mystery: number,
        thrill: number,
        complexity: number
    }
}
