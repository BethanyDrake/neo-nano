import styles from '@/lib/landingPage/page.module.css'
import {  getCurrentChallenge } from '../challenges'
import { dateToChallengeDay } from '../serverFunctions/goals/goalUtils'
import { startOfToday } from 'date-fns'
import { getDateAsString } from '../misc'
import { prompts } from '../tools/promptTool/promptList'
import Link from 'next/link'

export const BrainstormingPromptSection = () => {
    const challenge = getCurrentChallenge()
    if (!challenge || challenge.id !== 'preptober-2026' ) {
        return null
    }
     
    const today = getDateAsString(startOfToday())
    const challengeDay = dateToChallengeDay(challenge!.startDate, today)
    const Prompt = prompts[challengeDay].Component

    return (<div className={styles.brainstormingPromptSection}>
    <h2>{"Prompt:"}
        </h2>
        <Prompt/>
        <Link href="/tools/prompts">See more</Link>
        
        </div>)
}