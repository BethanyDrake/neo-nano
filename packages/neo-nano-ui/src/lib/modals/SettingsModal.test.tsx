import { updateEmailPreferences } from '@/lib/serverFunctions/settings/updateEmailPreferences'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { ModalContextProvider } from './ModalContext'
import { SettingsModal } from './SettingsModal'
import { getEmailPreferences } from '../serverFunctions/settings/getEmailPreferences'
import { vi } from 'vitest'

vi.mock('@/lib/serverFunctions/settings/updateEmailPreferences')
vi.mock('@/lib/serverFunctions/settings/getEmailPreferences')
describe('<SettingsModal />', () => {
  test('update email preferences', async () => {
    vi.mocked(updateEmailPreferences).mockResolvedValue()
    vi
      .mocked(getEmailPreferences)
      .mockResolvedValue({ recieveChallengeReminders: false, revieveEncouragmentEmails: false })
    const { getByRole, queryByRole } = render(
      <ModalContextProvider>
        <SettingsModal />
      </ModalContextProvider>,
    )

    await waitFor(() => {
      expect(getByRole('button', { name: 'settings' })).toBeEnabled()
    })
    fireEvent.click(getByRole('button', { name: 'settings' }))
    expect(getByRole('heading', { name: 'Settings' }))

    fireEvent.click(getByRole('checkbox', { name: /remind me about upcoming challenges/ }))
    fireEvent.click(getByRole('checkbox', { name: /send me encouragement throughout the challenge/ }))

    fireEvent.click(getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(updateEmailPreferences).toHaveBeenCalledWith({
        recieveChallengeReminders: true,
        revieveEncouragmentEmails: true,
      })
    })

    await waitFor(() => {
      expect(queryByRole('heading', { name: 'Settings' })).not.toBeInTheDocument()
    })
  })
})
