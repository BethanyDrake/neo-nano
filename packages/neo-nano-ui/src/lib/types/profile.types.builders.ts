import { Award } from "./profile.types"

export const buildAward = (overrides: Partial<Award> = {}): Award => ({
    id: '',
    title: '',
    description: '',
    requirementUnit: 'words',
    requirementValue: 0,
    imageUrl: '',
    // yyyy-MM-dd
    startDate: '0000-00-00',
    // yyyy-MM-dd
    endDate: '0000-00-00',
    ...overrides
   
})
