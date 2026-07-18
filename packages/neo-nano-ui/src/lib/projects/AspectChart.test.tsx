import { render } from "@testing-library/react"
import { AspectChart } from "./AspectChart"

describe("AspectChart", () => {
  it('renders', ()=> {
    render(<AspectChart aspects={{romance: 10, fantasy:20, mystery:30, thrill:40, complexity:100}}/>)
  })
})