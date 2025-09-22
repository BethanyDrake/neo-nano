'use client'
import { Breadcrumbs } from '@/lib/Breadcrumbs'
import { CommentCard } from '@/lib/CommentCard'
import { useThreadContext } from '@/lib/ThreadContext'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { ExtendableIconButton } from '@/lib/buttons/ExtendableIconButton'
import formClasses from '@/lib/form.module.css'
import { Category, Thread, Topic } from '@/lib/forum.types'
import { Column, Row } from '@/lib/layout'
import { COMMENTS_PER_PAGE } from '@/lib/misc'
import { addThreadComment } from '@/lib/serverFunctions/forum/addThreadComment'
import styles from '@/lib/styles/forum.module.css'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const RichTextEditor = dynamic(() => import('@/lib/richText/RichTextEditor'), {
  ssr: false,
})
type Inputs = {
  commentText: string
}

const AddCommentForm = ({ threadId }: { threadId: string }) => {
  const { handleSubmit, reset } = useForm<Inputs>()

  const { updateCommentsData } = useThreadContext()

  const [richText, setRichText] = useState('')
  const [plainText, setPlainText] = useState('')

  const [errors, setErrors] = useState({ commentText: false })
  const _onSubmit: SubmitHandler<Inputs> = async () => {
    const commentTextError = !richText
    setErrors({ commentText: commentTextError })
    if (!commentTextError) {
      console.log('submitting')
      await addThreadComment(threadId, plainText, richText).then(() => {
        reset()
        updateCommentsData()
      })
    }
  }

  return (
    <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        {errors.commentText && <span>This field is required</span>}
        <RichTextEditor setValue={setRichText} value={richText} setPlainText={setPlainText} />

        <BasicButton buttonProps={{ type: 'submit' }}>Post!</BasicButton>
      </Column>
    </form>
  )
}

export const ThreadPage = ({
  thread,
  topic,
  category,
  isLoggedIn,
}: {
  thread: Thread
  topic: Topic
  category: Category
  isLoggedIn: boolean
}) => {
  const [createThreadFormIsOpen, setCreateThreadFormIsOpen] = useState(false)

  const breadcrumbItems = [
    { href: '/forum', text: category.title },
    { href: `/forum/${topic.id}`, text: topic.title },
    { text: thread.title },
  ]

  const { commentsData, onPageChange, currentPage, totalComments } = useThreadContext()
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
          />
        </Row>

        <ExtendableIconButton
          icon={faAdd}
          onClick={() => (isLoggedIn ? setCreateThreadFormIsOpen(true) : redirect('/auth/login'))}
          text="Add Comment"
        />
        {createThreadFormIsOpen && <AddCommentForm threadId={thread.id} />}
      </Column>
    </div>
  )
}
