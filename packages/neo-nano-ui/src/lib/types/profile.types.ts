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

export const buildAward = (overrides: Partial<Award> = {}): Award  => {
  return {
    id: '',
    title: '',
    description: '',
    requirementUnit: 'words',
    requirementValue: 0,
    imageUrl: '',
    startDate: '',
    endDate: '',
    ...overrides
  }
}

export const buildUserAward = (overrides: Partial<UserAward> ={}): UserAward => ({
  ...buildAward(),
  awardedAt: new Date(),
  awardedTo: '',
  ...overrides,
})