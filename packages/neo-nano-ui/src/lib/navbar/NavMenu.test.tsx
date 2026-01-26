import { getIsModerator } from '@/lib/serverFunctions/moderation/getIsModerator'
import { NavMenu } from './NavMenu'
import { fireEvent, render } from '@testing-library/react'
jest.mock('@/lib/serverFunctions/moderation/getIsModerator')

describe('<NavMenu />', () => {

        test('regular user', async () => {  
        jest.mocked(getIsModerator).mockResolvedValue(false)
        const {findByRole, getByRole } = render(<NavMenu />)
        expect(getByRole('button')).toBeInTheDocument()
        fireEvent.click(getByRole('button'))
        await findByRole('menuitem', {name: 'Home'})

    })
    test('moderator', async () => {
        jest.mocked(getIsModerator).mockResolvedValue(true)
        const {findByRole, getByRole,  } = render(<NavMenu />)
        expect(getByRole('button')).toBeInTheDocument()
        fireEvent.click(getByRole('button'))
            
        await findByRole('menuitem', {name: 'Moderation'})

    })
})