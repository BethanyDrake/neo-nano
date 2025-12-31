export type Award = {
    id: string,
    title: string,
    description: string,
    requirementUnit: 'words' | 'days' | 'comments' | 'minutes',
    requirementValue: number,
    imageUrl: string,
    // yyyy-MM-dd
    startDate: string,
    // yyyy-MM-dd
    endDate: string
   
}

export type UserAward = Award & {
  awardedTo: string,
  awardedAt: Date,
}