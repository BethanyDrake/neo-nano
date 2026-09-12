import { render } from '@testing-library/react'
import { ProfileLinks } from './ProfileLinksSection'

describe('ProfileLinks', () => {
  it('renders', () => {
    const { getByText, getAllByRole } = render(
      <ProfileLinks
        links={{
          ao3: 'ao3-id',
          substack: '@substack',
          wattpad: 'wattpad-id',
          bluesky: '@bluesky',
        }}
      />,
    )

    expect(getByText('Follow my writing:')).toBeInTheDocument()
    expect(getAllByRole('link')).toHaveLength(4)
  })

  it('hides the section if no links are defined', () => {
    const { queryByText } = render(
      <ProfileLinks
        links={{
          ao3: undefined,
          substack: undefined,
          wattpad: undefined,
          bluesky: undefined,
        }}
      />,
    )

    expect(queryByText('Follow my writing:')).toBeNull()
  })
})
