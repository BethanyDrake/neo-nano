import { render } from '@testing-library/react'
import { buildAward } from '@/lib/types/profile.types.builders'
import { TrophyCounts } from './AwardCounts'

describe('<AwardCounts />', () => {
  it('renders', async () => {
    const { getByText } = render(
          <TrophyCounts awardCounts={[
        {
          ...buildAward({ id: '1', title: 'Some Title', description: 'Some award description', imageUrl: '/image' }),
          count: 700,
        },
      ]} />
      )

    expect(getByText('x700')).toBeInTheDocument()
  })
})
