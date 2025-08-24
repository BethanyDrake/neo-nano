export type Comment = {
    id: string
    title: string
    author: string
}

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
}

export type Category = {
    id:string
    title: string
    topics: Topic[]
}