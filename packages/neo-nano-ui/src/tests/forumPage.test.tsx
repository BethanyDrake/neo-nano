import { render } from '@testing-library/react'
import Forum from '@/app/forum/page'
import { getForumTopics } from '@/lib/serverFunctions/forum/getForumTopics'

jest.mock('@/lib/serverFunctions/forum/getForumTopics')
jest.mock('next/server')

describe('<Forum />', () => {
  it('displays categories and topics', async () => {
    jest.mocked(getForumTopics).mockResolvedValue([
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

    expect(getByText('Some Category Title')).toBeInTheDocument()
    expect(getByText('Some Topic Title')).toBeInTheDocument()
    expect(getByText('some descripiton')).toBeInTheDocument()
    expect(getByText('5')).toBeInTheDocument()
    expect(getByText('3')).toBeInTheDocument()
  })
})
