import { getRecentlyUpdatedThreads } from "@/lib/serverFunctions/forum/getRecentlyUpdatedThreads"
import { ThreadCard } from "@/lib/ThreadCard"
import { Column } from "@/lib/layoutElements/flexLayouts"
import { Breadcrumbs } from "@/lib/Breadcrumbs"
import { connection } from "next/server"
import { FullWidthPage } from "@/lib/layoutElements/FullWidthPage"


export default async function Page() {
  await connection()
  const recentlyUpdatedThreads = await getRecentlyUpdatedThreads()
      const breadcrumbItems = [
    { href: '/forum', text: 'Forum'},
    {  text: 'Recent' },
  ]
  return  <FullWidthPage>
    
    
    <Column> <Breadcrumbs breadcrumbItems={breadcrumbItems} />
    {recentlyUpdatedThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} topicId={thread.topic}/>)}
    </Column></FullWidthPage>
}

