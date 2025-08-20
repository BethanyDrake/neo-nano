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