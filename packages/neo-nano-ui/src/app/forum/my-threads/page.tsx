
import { ThreadCard } from "@/lib/ThreadCard"
import styles from '@/lib/styles/forum.module.css'
import { Column } from "@/lib/layout"
import { Breadcrumbs } from "@/lib/Breadcrumbs"
import { getMyThreads } from "@/lib/serverFunctions/forum/getMyThreads"


export default async function Page() {
  const myThreads = await getMyThreads()
      const breadcrumbItems = [
    { href: '/forum', text: 'Forum'},
    {  text: 'My Threads' },
  ]

  console.log('myThreads', myThreads)
  return  <div className={styles['forum-container']}>
    
    
    <Column> <Breadcrumbs breadcrumbItems={breadcrumbItems} />{myThreads.map((thread) => <ThreadCard key={thread.id} thread={thread} topicId={thread.topic}/>)}</Column></div>
}

