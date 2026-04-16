'use client'
import { Breadcrumbs } from '@/lib/Breadcrumbs'
import { ExtendableIconButton } from '@/lib/buttons/ExtendableIconButton'
import { CommentCard } from '@/lib/commentCards/CommentCard'
import { useThreadContext } from '@/lib/context/ThreadContext'
import { ExpandableAddCommentForm } from '@/lib/expandableForms/AddCommentForm'
import { Category, Thread, Topic } from '@/lib/types/forum.types'
import { Column, Row } from '@/lib/layoutElements/flexLayouts'
import { COMMENTS_PER_PAGE } from '@/lib/misc'
import { faAdd, faLock } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import enUS from 'rc-pagination/lib/locale/en_US'
import { FullWidthPage } from '@/lib/layoutElements/FullWidthPage'
import { useIsLoggedIn } from '@/lib/hooks/useIsLoggedIn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const ThreadPage = ({ thread, topic, category }: { thread: Thread; topic: Topic; category: Category }) => {

  const isLoggedIn = useIsLoggedIn()

  const { commentsData, onPageChange, currentPage, totalComments, isLoading, isLocked } = useThreadContext()

   const breadcrumbItems = [
    { href: '/forum', text: category.title },
    { href: `/forum/${topic.id}`, text: topic.title },
    { text: <span>{thread.title} {isLocked &&<FontAwesomeIcon icon={faLock}/>}</span> },
  ]
  return (
    <FullWidthPage>
      <Column>
        <Row justifyContent="space-between">
          <Breadcrumbs breadcrumbItems={breadcrumbItems} />
          <Pagination
            locale={enUS}
            pageSize={COMMENTS_PER_PAGE}
            onChange={onPageChange}
            current={currentPage}
            total={totalComments}
            disabled={isLoading}
          />
        </Row>
        <div>
          {commentsData &&
            commentsData.map(({ comment, author, flags, snapshots }) => (
              <CommentCard key={comment.id} comment={comment} author={author} flags={flags} snapshots={snapshots} />
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

        {!isLocked && isLoggedIn && <ExpandableAddCommentForm />} 
        {!isLocked && !isLoggedIn && <Link prefetch={false} href={`/auth/login?returnTo=/forum/${topic.id}/${thread.id}`}>
            <ExtendableIconButton text="Log in to comment" icon={faAdd} />
          </Link>}   
      </Column>
    </FullWidthPage>
  )
}
