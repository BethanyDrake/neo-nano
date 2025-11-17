import { getRecentlyUpdatedThreads } from "@/lib/serverFunctions/forum/getRecentlyUpdatedThreads"
import { ThreadCard } from "@/lib/ThreadCard"
import styles from '@/lib/styles/forum.module.css'
import { Column } from "@/lib/layout"
import { Breadcrumbs } from "@/lib/Breadcrumbs"
import { connection } from "next/server"


export default async function Page() {
  await connection()
  const recentlyUpdatedThreads = await getRecentlyUpdatedThreads()
      const breadcrumbItems = [
    { href: '/forum', text: 'Forum'},
    {  text: 'Recent' },
  ]
  return  <div className={styles['forum-container']}>
    
    
    <Column> <Breadcrumbs breadcrumbItems={breadcrumbItems} />
    {recentlyUpdatedThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} topicId={thread.topic}/>)}
    </Column></div>
}

