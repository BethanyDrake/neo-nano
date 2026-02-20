import { getIsModerator } from '@/lib/serverFunctions/moderation/getIsModerator'
import { NavMenu } from './NavMenu'
import { fireEvent, render } from '@testing-library/react'
import { vi } from 'vitest'
vi.mock('@/lib/serverFunctions/moderation/getIsModerator')

describe('<NavMenu />', () => {

        test('regular user', async () => {  
        vi.mocked(getIsModerator).mockResolvedValue(false)
        const {findByRole, getByRole } = render(<NavMenu />)
        expect(getByRole('button'))
        fireEvent.click(getByRole('button'))
        await findByRole('menuitem', {name: 'Home'})

    })
    test('moderator', async () => {
        vi.mocked(getIsModerator).mockResolvedValue(true)
        const {findByRole, getByRole,  } = render(<NavMenu />)
        expect(getByRole('button'))
        fireEvent.click(getByRole('button'))
            
        await findByRole('menuitem', {name: 'Moderation'})

    })
})