import { ClientSideOnly } from "@/lib/ClientSideOnly"
import { getFlaggedComments } from "@/lib/serverFunctions/moderation/getFlaggedComments"
import { getIsModerator } from "@/lib/serverFunctions/moderation/getIsModerator"
import {ModerationPage} from "./ModerationPage"
import { auth0 } from "@/lib/auth0"

const Page = async () => {
  const isModerator = await getIsModerator()
  const flaggedComments = await getFlaggedComments()
  if (!isModerator) return <div>
    Access Denied
  </div>
  return <ClientSideOnly><ModerationPage flaggedComments={flaggedComments} /></ClientSideOnly>
}

export default auth0.withPageAuthRequired(Page, {returnTo: '/moderation'}) as () => Promise<React.JSX.Element>
