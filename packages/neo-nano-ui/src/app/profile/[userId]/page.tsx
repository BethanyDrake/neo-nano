import { PublicGoalSection } from '@/lib/goalTracker/PublicGoalSection'
import { Centered } from '@/lib/layoutElements/flexLayouts'
import { getPublicGoals } from '@/lib/serverFunctions/goals/getPublicGoals'
import { getPublicProfile } from '@/lib/serverFunctions/profile/publicProfile'
import { TrophyCase } from '@/lib/awards/TrophyCase'
import { getPublicAwards } from '@/lib/serverFunctions/awards/getPublicAwards'
import { FullWidthPage } from '@/lib/layoutElements/FullWidthPage'
import { getPublicProjects } from '@/lib/serverFunctions/projects/getPublicProjects'
import { PublicProjectSection } from '@/lib/projects/PublicProjectSection'

const PublicProfilePage = async ({ params }: { params: Promise<{ userId: string }> }) => {
  const userId = (await params).userId
  const [profile, goals, awards, projects] = await Promise.all([getPublicProfile(userId), getPublicGoals(userId),getPublicAwards(userId), getPublicProjects(userId)])

  return (
    <FullWidthPage>
      <Centered>
        <h1>{profile.displayName}&apos;s Profile</h1>
      </Centered>
      <h2>{profile.displayName}</h2>
      {profile.role === 'moderator' && <p>Moderator</p>}
      <p style={{ whiteSpaceCollapse: 'preserve' }}>{profile.aboutMe}</p>
        
      <TrophyCase awards={awards}/>
      {projects.map((project) => (
        <PublicProjectSection key={project.id} project={project} />
      ))}
      {goals.map((goal) => (
        <PublicGoalSection key={goal.id} goal={goal} />
      ))}
     
    </FullWidthPage>
  )
}

export default PublicProfilePage
