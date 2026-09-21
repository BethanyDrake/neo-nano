import { dateToChallengeDay } from '../serverFunctions/goals/goalUtils'
import { startOfToday } from 'date-fns'
import { getDateAsString } from '../misc'
import { prompts } from '../tools/promptTool/promptList'
import Link from 'next/link'
import { InfoBubble } from './InfoBubble'
const preptober = {
  title: 'Preptober',
  startDate: '2026-10-01',
  lengthDays: 31,
  target: 30 * 31,
  metric: 'minutes',
  id: 'preptober-2026',
}

export const BrainstormingPromptSection = () => {
  const challenge = preptober

  const today = getDateAsString(startOfToday())
  const challengeDay = dateToChallengeDay(challenge!.startDate, today)

  if (challengeDay < 0) {
    return (
      <InfoBubble
        title="Not sure what to write?"
        style={{ border: '4px dashed var(--tertiary-vibrant)', maxWidth: '250px' }}
      >
        <p>Join us in October for daily branstorming prompts!</p>
      </InfoBubble>
    )
  }
  if (challengeDay >= 31) {
    return null
  }

  const Prompt = prompts[challengeDay].Component

  return (
    <InfoBubble
      title={'Brainstorming Prompt:'}
      style={{ border: '4px dashed var(--tertiary-vibrant)', maxWidth: '350px' }}
    >
      <Prompt />
      <Link href="/tools/prompts">See more</Link>
    </InfoBubble>
  )
}
