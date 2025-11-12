import { getRecentlyUpdatedThreads } from "@/lib/serverFunctions/forum/getRecentlyUpdatedThreads"
import { ThreadCard } from "@/lib/ThreadCard"
import styles from '@/lib/styles/forum.module.css'
import { Column } from "@/lib/layout"


export default async function Page() {
  const recentlyUpdatedThreads = await getRecentlyUpdatedThreads()
    console.log(recentlyUpdatedThreads)
  return  <div className={styles['forum-container']}>
    
    
    <Column><h1>Recent Activity:</h1>{recentlyUpdatedThreads.map((recentlyUpdatedThreads) => <ThreadCard key={recentlyUpdatedThreads.id} thread={recentlyUpdatedThreads} topicId={recentlyUpdatedThreads.topic}/>)}</Column></div>
}

