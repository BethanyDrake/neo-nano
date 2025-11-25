import { act, render } from '@testing-library/react'
import { Suspense } from 'react'
import { buildAward } from '@/lib/types/profile.types.builders'
import { TrophyCounts } from './AwardCounts'

describe('<AwardCounts />', () => {
  it('renders', async () => {

    const {findByText} = await act(() => {
      const awardPromise = Promise.resolve([
        {
          ...buildAward({ id: '1', title: 'Some Title', description: 'Some award description', imageUrl: '/image' }),
          count: 700,
        },
      ])
      return render(
        <Suspense>
          <TrophyCounts awardCountsPromise={awardPromise} />
        </Suspense>,
      )
    })
    

    expect(await findByText('x700')).toBeInTheDocument()
  })
})
