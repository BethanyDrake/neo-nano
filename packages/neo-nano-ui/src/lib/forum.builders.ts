import { Comment } from "./forum.types"
import { ThreadSummary } from "./serverFunctions/forum/getThreads"

export const buildComment = (comment: Partial<Comment> = {}) => ({
    id: '',
    text: '',
    richText: '',
    author: '',
    createdAt: Date(),
    ...comment
})

export const buildThreadSummary = (threadSummary: Partial<ThreadSummary> = {}) => ({
    id: '',
    title: '',
    author: '',
    totalComments: 0,
    text: '',
    ...threadSummary
})

export type Thread = {
    id: string
    title: string
    author: string
}

export type Topic = {
    id: string
    title: string
    description: string
    icon: 'faBoltLightning'| 'faPerson' | 'faShield' | 'faPenFancy'
    category: string
}

export type Category = {
    id:string
    title: string
    topics: Topic[]
}

export type Profile = {
    id:string
    displayName: string
    aboutMe?: string | null
    role: 'user' | 'moderator'
}

export type Visibility ='private' | 'public'

export type Record = (number | null)
export type Goal = {
    id:string
    title: string
    // yyyy-MM-dd
    startDate: string
    lengthDays: number
    records: Record[]
    userId: string
    target: number
    visibility: Visibility
}

export type Flag = {
    id: string
    reason: 'sexual-content' | 'harrassment' | 'spam' | 'other'
    reportedBy: string,
    createdAt: Date,
    details: string,
    comment: string,
    reviewedBy?: string,
    reviewOutcome?: 'confirmed'| 'overruled'
}