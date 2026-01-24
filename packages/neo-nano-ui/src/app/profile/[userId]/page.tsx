import { Goal, Profile } from '@/lib/types/forum.types'
import { PublicGoalSection } from '@/lib/goalTracker/PublicGoalSection'
import { Centered } from '@/lib/layoutElements/flexLayouts'
import { getPublicGoals } from '@/lib/serverFunctions/goals/getPublicGoals'
import { getPublicProfile } from '@/lib/serverFunctions/profile/publicProfile'
import { TrophyCase } from '@/lib/awards/TrophyCase'
import { UserAward } from '@/lib/types/profile.types'
import { getPublicAwards } from '@/lib/serverFunctions/awards/getPublicAwards'
import { FullWidthPage } from '@/lib/layoutElements/FullWidthPage'

const PublicProfilePage = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const userId = (await params).userId
  const profile: Profile = await getPublicProfile(userId)
  const goals: Goal[] = await getPublicGoals(userId)
  const awards: UserAward[] = await getPublicAwards(userId)

  return (
    <FullWidthPage>
      <Centered>
        <h1>{profile.displayName}&apos;s Profile</h1>
      </Centered>
      <h2>{profile.displayName}</h2>
      {profile.role === 'moderator' && <p>Moderator</p>}
      <p>{profile.aboutMe}</p>
      <TrophyCase awards={awards}/>
      {goals.map((goal) => (
        <PublicGoalSection key={goal.id} goal={goal} />
      ))}
    </FullWidthPage>
  )
}

export default PublicProfilePage
