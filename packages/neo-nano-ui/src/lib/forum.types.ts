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