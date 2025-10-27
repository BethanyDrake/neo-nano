import { render } from '@testing-library/react'
import { TrophyCase } from './TrophyCase'
import { UserAward } from '../profile.types'

describe('<TrophyCase />', () => {
  it('displays award trophies', () => {
    const trophies: UserAward[] = [
      {
        id: 'award-1',
        title: 'Some Title',
        description: 'Some description.',
        requirementUnit: 'words',
        requirementValue: 1677,
        imageUrl: 'https://www.some-image.png',
        // yyyy-MM-dd
        startDate: '2025-11-01',
        // yyyy-MM-dd
        endDate: '2025-11-01',
        awardedTo: 'user-2',
        awardedAt: new Date(),
      },
    ]

    const { getByText } = render(<TrophyCase awards={trophies} />)
    expect(getByText('Some Title')).toBeInTheDocument()
    expect(getByText('Some description.')).toBeInTheDocument()
  })
})
