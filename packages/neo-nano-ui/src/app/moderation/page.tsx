import { ClientSideOnly } from "@/lib/ClientSideOnly"
import { getFlaggedComments } from "@/lib/serverFunctions/moderation/getFlaggedComments"
import { getIsModerator } from "@/lib/serverFunctions/moderation/getIsModerator"
import {ModerationPage} from "./ModerationPage"

const Page = async () => {
  const isModerator = await getIsModerator()
  const flaggedComments = await getFlaggedComments()
  if (!isModerator) return <div>
    Access Denied
  </div>
  console.log(flaggedComments)
  return <ClientSideOnly><ModerationPage flaggedComments={flaggedComments} /></ClientSideOnly>
}

export default Page
