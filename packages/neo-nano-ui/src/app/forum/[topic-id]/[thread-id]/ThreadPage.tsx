'use client'
import { Breadcrumbs } from '@/lib/Breadcrumbs'
import { ExtendableIconButton } from '@/lib/buttons/ExtendableIconButton'
import { CommentCard } from '@/lib/commentCards/CommentCard'
import { useThreadContext } from '@/lib/context/ThreadContext'
import { useIsLoggedIn } from '@/lib/context/UserContext'
import { ExpandableAddCommentForm } from '@/lib/expandableForms/AddCommentForm'
import { Category, Thread, Topic } from '@/lib/forum.types'
import { Column, Row } from '@/lib/layout'
import { COMMENTS_PER_PAGE } from '@/lib/misc'
import styles from '@/lib/styles/forum.module.css'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'

export const ThreadPage = ({
  thread,
  topic,
  category,
}: {
  thread: Thread
  topic: Topic
  category: Category
}) => {

  const breadcrumbItems = [
    { href: '/forum', text: category.title },
    { href: `/forum/${topic.id}`, text: topic.title },
    { text: thread.title },
  ]

  const isLoggedIn = useIsLoggedIn()

  const { commentsData, onPageChange, currentPage, totalComments, isLoading } = useThreadContext()
  return (
    <div className={styles['forum-container']}>
      <Column>
        <Row justifyContent="space-between">
          <Breadcrumbs breadcrumbItems={breadcrumbItems} />
          <Pagination
            pageSize={COMMENTS_PER_PAGE}
            onChange={onPageChange}
            current={currentPage}
            total={totalComments}
            disabled={isLoading}
          />
        </Row>
        <div>
          {commentsData &&
            commentsData.map(({ comment, author, flags }) => (
              <CommentCard key={comment.id} comment={comment} author={author} flags={flags} />
            ))}
        </div>
        <Row justifyContent="right">
          <Pagination
            pageSize={COMMENTS_PER_PAGE}
            onChange={onPageChange}
            current={currentPage}
            total={totalComments}
            disabled={isLoading}
          />
        </Row>

          {
        isLoggedIn ? <ExpandableAddCommentForm /> :
        <Link prefetch={false} href={`/auth/login?returnTo=/forum/${topic.id}/${thread.id}`}><ExtendableIconButton text="Log in to comment" icon={faAdd}/></Link> 
      }
      </Column>
    </div>
  )
}
