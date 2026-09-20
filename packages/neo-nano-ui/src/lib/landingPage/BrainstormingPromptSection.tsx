import styles from '@/lib/landingPage/page.module.css'
import { dateToChallengeDay } from '../serverFunctions/goals/goalUtils'
import { startOfToday } from 'date-fns'
import { getDateAsString } from '../misc'
import { prompts } from '../tools/promptTool/promptList'
import Link from 'next/link'
const preptober =  {
    title: 'Preptober',
    startDate: '2026-10-01',
    lengthDays: 31,
    target: 30*31,
    metric: 'minutes',
    id: 'preptober-2026'
  }

export const BrainstormingPromptSection = () => {
    const challenge = preptober
     
    const today = getDateAsString(startOfToday())
    const challengeDay = dateToChallengeDay(challenge!.startDate, today)
    if (challengeDay < 0 || challengeDay >=31)  {
        return null
    }
    const Prompt = prompts[challengeDay].Component

    return (<div className={styles.brainstormingPromptSection}>
    <h2>{"Prompt:"}
        </h2>
        <Prompt/>
        <Link href="/tools/prompts">See more</Link>
        
        </div>)
}