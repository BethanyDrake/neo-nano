import { getThreads } from "@/lib/serverFunctions/forum/getThreads"
import { getTopic } from "@/lib/serverFunctions/forum/getTopic"
import TopicPage from "./TopicPage"
import { auth0 } from "@/lib/auth0"


export default async function Page({
  params,
}: {
  params: Promise<{ "topic-id": string }>
}) {
  
  const session = await auth0.getSession()
  const topicId = (await params)['topic-id'] as string
  const { topic, category } = await getTopic(topicId)

  const initialThreads = await getThreads(topicId)

  return <TopicPage topic={topic} category={category} initialThreads={initialThreads} isLoggedIn={!!session} />
}

