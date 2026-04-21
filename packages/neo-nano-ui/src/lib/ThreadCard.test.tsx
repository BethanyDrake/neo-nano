import { render } from '@testing-library/react'
import { ThreadCard } from './ThreadCard'
import { buildThreadSummary } from './types/forum.builders'

describe('ThreadCard', () => {
  test('thread with comments', () => {
    const { getByText } = render(
      <ThreadCard
        thread={buildThreadSummary({
          authorDisplayName: 'Some Author',
          totalComments: 7,
          text: 'Some very long long long long comment text that will be truncated. Some very long long long long comment text that will be truncated.',
        })}
        topicId={''}
      />,
    )
    expect(
      getByText(
        'Some Author: Some very long long long long comment text that will be truncated. Some very long long long long com...',
      ),
    ).toBeInTheDocument()
    expect(getByText('7')).toBeInTheDocument()
  })

  test('deleted thread', () => {
    const { getByText } = render(<ThreadCard thread={buildThreadSummary({ removalStatus: 'DELETED' })} topicId={''} />)
    expect(getByText('This thread has been deleted by the author')).toBeInTheDocument()
  })
})
