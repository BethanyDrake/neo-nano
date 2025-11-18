import { updateEmailPreferences } from '@/lib/serverFunctions/settings/updateEmailPreferences'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { ModalContextProvider } from './ModalContext'
import { SettingsModal } from './SettingsModal'

jest.mock('@/lib/serverFunctions/settings/updateEmailPreferences')
describe('<SettingsModal />', () => {
  test('update email preferences', async () => {
    jest.mocked(updateEmailPreferences).mockResolvedValue()
    const { getByRole } = render(
        <ModalContextProvider>
        <SettingsModal />
        </ModalContextProvider>
    )
    fireEvent.click(getByRole('button', { name: 'settings' }))
    expect(getByRole('heading', { name: 'Settings' })).toBeInTheDocument()

    fireEvent.click(getByRole('checkbox', { name: /remind me about upcoming challenges/ }))
    fireEvent.click(getByRole('checkbox', { name: /send me encouragement throughout the challenge/ }))

    fireEvent.click(getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(updateEmailPreferences).toHaveBeenCalledWith({
        recieveChallengeReminders: true,
        revieveEncouragmentEmails: true
      })
    })
  })
})
