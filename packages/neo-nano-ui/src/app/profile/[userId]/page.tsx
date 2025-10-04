import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'
import { Goal, Profile } from '@/lib/forum.types'
import { WordsPerDay } from '@/lib/charts/WordsPerDay'
import { Centered } from '@/lib/layout'
import profileClassNames from '../profile.module.css'
import { getPublicProfile } from '@/lib/serverFunctions/profile/publicProfile'
import { getPublicGoals } from '@/lib/serverFunctions/goals/getPublicGoals'
import { ClientSideOnly } from '@/lib/ClientSideOnly'
const PublicProfilePage = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const userId = (await params).userId
  const session = await auth0.getSession()
  if (!session) {
    return redirect(`${process.env.APP_BASE_URL}/auth/login?returnTo=${process.env.APP_BASE_URL}/profile`)
  }

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
      {goals.map(({ id, title, records }) => (
        <div key={id} style={{ padding: '16px' }}>
          <Centered>
            <h2>{title}</h2>
          </Centered>
          <ClientSideOnly>
            <div className={profileClassNames['goal-row']}>
              <WordsPerDay title={title} wordCountPerDay={records} />
            </div>
          </ClientSideOnly>
        </div>
      ))}
    </div>
  )
}

export default PublicProfilePage
