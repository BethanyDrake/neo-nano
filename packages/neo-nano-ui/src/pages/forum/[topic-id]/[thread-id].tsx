import { ReturnType } from '@/app/api/comments/route'
import { Breadcrumbs } from '@/lib/Breadcrumbs'
import { ExtendableIconButton } from '@/lib/buttons/ExtendableIconButton'
import { Category, Comment, Thread, Topic } from '@/lib/forum.types'
import { Column } from '@/lib/layout'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { NextPageContext } from 'next'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import styles from '../index.module.css'
import formClasses from '@/lib/form.module.css'
import { BasicButton } from '@/lib/buttons/BasicButton'

type Inputs = {
  commentText: string
}

const AddCommentForm = ({ threadId, onSubmit }: { threadId: number; onSubmit: () => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const _onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const body = {
      ...data,
      thread: threadId,
    }
    await axios.post(`/api/comments`, body).then(() => {
      reset()
      onSubmit()
    })
  }

  return (
    <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        <label htmlFor="comment">Comment</label>
        <input id="comment" {...register('commentText', { required: true })} />
        {errors.commentText && <span>This field is required</span>}

        <BasicButton buttonProps={{type:"submit"}}>Post!</BasicButton>
      </Column>
    </form>
  )
}

const ThreadPage = ({
  thread,
  topic,
  category,
  initialComments,
}: {
  thread: Thread
  topic: Topic
  category: Category
  initialComments: Comment[]
}) => {
  const [createThreadFormIsOpen, setCreateThreadFormIsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>(initialComments)

  const updateComments = useCallback(async () => {
    const _comments: Comment[] = (await axios.get<ReturnType>(`/api/comments?thread=${thread.id}`)).data.comments
    setComments(_comments)
  }, [thread])

  const breadcrumbItems = [
    { href: '/forum', text: category.title },
    { href: `/forum/${topic.id}`, text: topic.title },
    { text: thread.title },
  ]

  return (
    <div className={styles['forum-container']}>
      <Column>
        <Breadcrumbs breadcrumbItems={breadcrumbItems} />
        <div>
          {comments &&
            comments.map((comment: Comment) => {
              return (
                <div key={comment.id}>
                  <p>
                    <span style={{ fontWeight: 'bold' }}>{comment.authorDisplayName}</span>: {comment.text}
                  </p>
                </div>
              )
            })}
        </div>
        <ExtendableIconButton icon={faAdd} onClick={() => setCreateThreadFormIsOpen(true)} text="Add Comment" />
        {createThreadFormIsOpen && <AddCommentForm onSubmit={updateComments} threadId={thread.id} />}
      </Column>
    </div>
  )
}

ThreadPage.getInitialProps = async (context: NextPageContext) => {
  const threadId = context.query['thread-id'] as string
  const response = (
    await axios.get<ReturnType>(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/comments?thread=${threadId}`)
  ).data
  const { thread, category, comments, topic } = response

  return {
    thread,
    category,
    topic,
    initialComments: comments,
  }
}

export default ThreadPage
