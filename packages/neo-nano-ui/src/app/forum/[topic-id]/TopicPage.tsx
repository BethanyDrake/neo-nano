'use client'
import { Breadcrumbs } from '@/lib/Breadcrumbs'
import { ExtendableIconButton } from '@/lib/buttons/ExtendableIconButton'
import { useTopicContext } from '@/lib/context/TopicContext'
import { CreateThreadExtendableForm } from '@/lib/expandableForms/CreateThreadForm'
import { Category } from '@/lib/types/forum.types'
import { Column, Row } from '@/lib/layoutElements/flexLayouts'
import { THREADS_PER_PAGE } from '@/lib/misc'
import { ThreadSummary } from '@/lib/serverFunctions/forum/getThreads'
import styles from '@/lib/styles/forum.module.css'
import { ThreadCard } from '@/lib/ThreadCard'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import enUS from 'rc-pagination/lib/locale/en_US'

type Topic = {
  id: string
  title: string
  description: string
}

const TopicPage = ({ topic, category, isLoggedIn }: { topic: Topic; category: Category; isLoggedIn: boolean }) => {
  const { threadsData: threads, onPageChange, currentPage, totalThreads, isLoading } = useTopicContext()

  const breadcrumbItems = [{ href: '/forum', text: category.title }, { text: topic.title }]
  return (
    <div className={styles['forum-container']}>
      <Column>
        <Row justifyContent="space-between">
          <Breadcrumbs breadcrumbItems={breadcrumbItems} />
          <Pagination
            locale={enUS}
            pageSize={THREADS_PER_PAGE}
            onChange={onPageChange}
            current={currentPage}
            total={totalThreads}
            disabled={isLoading}
          />
        </Row>
        <p>{topic.description}</p>
        {isLoggedIn ? (
          <CreateThreadExtendableForm />
        ) : (
          <Link prefetch={false} href={`/auth/login?returnTo=/forum/${topic.id}`}>
            <ExtendableIconButton text="Log in to start a thread" icon={faAdd} />
          </Link>
        )}

        <Column>
          <h2>Threads:</h2>
          {threads &&
            threads.map((thread: ThreadSummary) => <ThreadCard key={thread.id} topicId={topic.id} thread={thread} />)}
        </Column>
      </Column>
    </div>
  )
}

export default TopicPage
