import { render } from '@testing-library/react'
import Forum from '@/app/forum/page'
import { getForumTopics } from '@/lib/serverFunctions/forum/getForumTopics'
import { vi } from 'vitest'
vi.mock('@/lib/serverFunctions/forum/getForumTopics')
vi.mock('next/server')

describe('<Forum />', () => {
  it('displays categories and topics', async () => {
    vi.mocked(getForumTopics).mockResolvedValue([
      {
        id: '1',
        title: 'Some Category Title',
        topics: [
          {
            id: '2',
            title: 'Some Topic Title',
            description: 'some descripiton',
            icon: 'faPenFancy',
            category: '1',
            total_comments: 5,
            total_threads: 3,
          },
        ],
      },
    ])
    const { getByText } = render(await Forum())

    expect(getByText('Some Category Title'))
    expect(getByText('Some Topic Title'))
    expect(getByText('some descripiton'))
    expect(getByText('5'))
    expect(getByText('3'))
  })
})
