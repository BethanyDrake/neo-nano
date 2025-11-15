import { auth0 } from "@/lib/auth0"
import { ModeratorOnly } from "@/lib/moderation/ModeratorOnly"
import { getFlaggedComments } from "@/lib/serverFunctions/moderation/getFlaggedComments"
import { ModerationPage } from "../../lib/moderation/ModerationPage"

const Page = async () => {
  const flaggedComments = await getFlaggedComments()
  return <ModeratorOnly fallback={<div>
    Access Denied
  </div>}><ModerationPage flaggedComments={flaggedComments} /></ModeratorOnly>
}

export default auth0.withPageAuthRequired(Page, {returnTo: '/moderation'}) as () => Promise<React.JSX.Element>
