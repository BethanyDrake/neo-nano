import { Goal, Profile } from '@/lib/forum.types'
import { PublicGoalSection } from '@/lib/goalTracker/PublicGoalSection'
import { Centered } from '@/lib/layout'
import { getPublicGoals } from '@/lib/serverFunctions/goals/getPublicGoals'
import { getPublicProfile } from '@/lib/serverFunctions/profile/publicProfile'

const PublicProfilePage = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const userId = (await params).userId
  const profile: Profile = await getPublicProfile(userId)
  const goals: Goal[] = await getPublicGoals(userId)

  return (
    <div style={{ padding: '24px' }}>
      <Centered>
        <h1>{profile.displayName}&apos;s Profile</h1>
      </Centered>
      <h2>{profile.displayName}</h2>
      {profile.role === 'moderator' && <p>Moderator</p>}
      <p>{profile.aboutMe}</p>
      {goals.map((goal) => (
        <PublicGoalSection key={goal.id} goal={goal} />
      ))}
    </div>
  )
}

export default PublicProfilePage
