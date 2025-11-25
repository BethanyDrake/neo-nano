export type Comment = {
    id: string
    text: string
    richText: string
    author: string
    createdAt: Date
}

export type Thread = {
    id: string
    title: string
    author: string
    topic: string
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
    metric: 'words' | 'minutes'
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