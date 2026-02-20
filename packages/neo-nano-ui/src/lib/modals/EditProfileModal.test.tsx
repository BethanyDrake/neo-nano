import { fireEvent, render, waitFor } from '@testing-library/react'
import { EditProfileModal } from './EditProfileModal'
import { ProfileContextProvider } from '../context/ProfileContext'
import { updateProfile } from '../serverFunctions/profile/updateProfile'
import { buildProfile } from '@/lib/types/forum.builders'
import { ModalContextProvider } from './ModalContext'
import { vi } from 'vitest'

vi.mock('../serverFunctions/profile/updateProfile')
describe('<EditProfileModal />', () => {
  test('update profile', async () => {
    vi.mocked(updateProfile).mockResolvedValue(buildProfile())
    const { getByRole } = render(
      <ModalContextProvider>
        <ProfileContextProvider initialProfile={buildProfile()} initialAwards={[]}>
          <EditProfileModal />
        </ProfileContextProvider>
      </ModalContextProvider>,
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
