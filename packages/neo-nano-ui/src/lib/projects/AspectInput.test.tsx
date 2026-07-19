import { fireEvent, render } from "@testing-library/react"
import { AspectInputFormSection } from "./AspectInput"
import { buildAspects } from "./Project.type"

describe('AspectInput', () => {
  test('set fantasy to 20', () => {
    const setAspects = vi.fn()
    const {getByRole} = render(<AspectInputFormSection aspects={buildAspects()} setAspects={setAspects }/>)
    fireEvent.click(getByRole('button', {name: 'set fantasy to 20'}))
    expect (setAspects).toHaveBeenCalledWith(buildAspects({fantasy: 20}))
  })
})