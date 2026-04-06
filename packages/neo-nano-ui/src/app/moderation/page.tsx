import { auth0 } from "@/lib/auth0"
import { ModeratorOnly } from "@/lib/moderation/ModeratorOnly"
import { ModerationPage } from "../../lib/moderation/ModerationPage"

const Page = async () => {
  return <ModeratorOnly fallback={<div>
    Access Denied
  </div>}><ModerationPage /></ModeratorOnly>
}

export default auth0.withPageAuthRequired(Page, {returnTo: '/moderation'}) as () => Promise<React.JSX.Element>
