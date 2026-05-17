import { fireEvent, render, waitFor } from '@testing-library/react'
import { EditProfileModal } from './EditProfileModal'
import { ProfileContextProvider } from '../context/ProfileContext'
import { updateProfile } from '../serverFunctions/profile/updateProfile'
import { buildProfile } from '@/lib/types/forum.builders'
import { ModalContextProvider } from './ModalContext'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


vi.mock('../serverFunctions/profile/updateProfile')
vi.mock('@auth0/nextjs-auth0', () => ({useUser: () => ({})}))
describe('<EditProfileModal />', () => {
  test('update profile', async () => {
    vi.mocked(updateProfile).mockResolvedValue(buildProfile())
    const { getByRole } = render(
      <QueryClientProvider client={new QueryClient()}>
      <ModalContextProvider>
        <ProfileContextProvider initialProfile={buildProfile()} initialAwards={[]}>
          <EditProfileModal />
        </ProfileContextProvider>
      </ModalContextProvider></QueryClientProvider>,
    )
    fireEvent.click(getByRole('button', { name: 'edit profile' }))
    expect(getByRole('heading', { name: 'Update Profile Details' }))

    fireEvent.change(getByRole('textbox', { name: /Display Name/ }), { target: { value: 'New Name' } })
    fireEvent.change(getByRole('textbox', { name: /About me/ }), { target: { value: 'Some details about myself.' } })

    fireEvent.click(getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith({
        aboutMe: 'Some details about myself.',
        displayName: 'New Name',
      })
    })
  })
})
