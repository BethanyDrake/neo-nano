import { render } from '@testing-library/react'
import Forum from '@/app/forum/page'
import { getForumTopics } from '@/lib/serverFunctions/forum/getForumTopics'


jest.mock('@/lib/serverFunctions/forum/getForumTopics')

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
          },
        ],
      },
    ])
    const { getByText } = render(await Forum())

    expect(getByText('Some Category Title')).toBeInTheDocument()
    expect(getByText('Some Topic Title')).toBeInTheDocument()
    expect(getByText('some descripiton')).toBeInTheDocument()
  })
})
