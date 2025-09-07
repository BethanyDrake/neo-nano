export type Comment = {
    id: string
    text: string
    author: string
    authorDisplayName: string
}

export type Thread = {
    id: number
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
}

export type Goal = {
    id:string
    title: string
    //yyyy-MM-dd
    startDate: string
    lengthDays: number
    records: number[]
    userId: string
    target: number
}