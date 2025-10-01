import { getIsModerator } from "@/lib/serverFunctions/moderation/getIsModerator"

export const ModeratorPage = async () => {
  const isModerator = await getIsModerator()
  if (!isModerator) return <div>
    Access Denied
  </div>
  return <div>Secret Moderator Page</div>
}

export default ModeratorPage
