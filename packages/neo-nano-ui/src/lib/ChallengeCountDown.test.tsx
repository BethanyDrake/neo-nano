import { render } from "@testing-library/react"
import { ChallengeCountDown } from "./ChallengeCountDown"

describe('<ChallengeCountDown />', () => {
  it('does not explode', () => {
    render(<ChallengeCountDown/>)
  })
})