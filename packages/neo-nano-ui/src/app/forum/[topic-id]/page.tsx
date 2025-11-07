import { getThreads } from "@/lib/serverFunctions/forum/getThreads"
import { getTopic } from "@/lib/serverFunctions/forum/getTopic"
import TopicPage from "./TopicPage"
import { auth0 } from "@/lib/auth0"
import { TopicContextProvider } from "@/lib/context/TopicContext"


export default async function Page({
  params,
}: {
  params: Promise<{ "topic-id": string }>
}) {
  const topicId = (await params)['topic-id'] as string
  const [session,{topic, category}, response ] = await Promise.all([
    auth0.getSession(),
    getTopic(topicId),
    getThreads(topicId)
  ])

  return <TopicContextProvider initialThreads={response.threadSummaries} initialTotalThreads={response.totalThreads} topicId={topicId}> <TopicPage topic={topic} category={category} isLoggedIn={!!session} /></TopicContextProvider>
}

