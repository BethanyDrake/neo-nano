import { render } from '@testing-library/react'
import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  test('two links and a page title', () => {
    const breadcrumbItems = [
      { href: '/forum', text: 'Category' },
      { href: `/forum/topic-id`, text: 'Topic' },
      { text: 'Thread' },
    ]
    const { getByRole } = render(<Breadcrumbs breadcrumbItems={breadcrumbItems} />)
    expect(getByRole('link', { name: 'Category' })).toBeInTheDocument()
    expect(getByRole('link', { name: 'Topic' })).toBeInTheDocument()
    expect(getByRole('heading', { name: 'Thread' })).toBeInTheDocument()
  })
})
