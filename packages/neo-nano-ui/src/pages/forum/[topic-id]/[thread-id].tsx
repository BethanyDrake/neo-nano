import { Comment, Thread } from '@/lib/forum.types'
import { Column } from '@/lib/layout'
import axios from 'axios'
import { NextPageContext } from 'next'
import { useCallback, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import styles from '../index.module.css'
import { ExtendableIconButton } from '@/lib/buttons/ExtendableIconButton'
import { ReturnType } from '@/app/api/comments/route'
import { faAdd } from '@fortawesome/free-solid-svg-icons'

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
    <form onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        <label htmlFor="comment">Comment</label>
        <input id="comment" {...register('commentText', { required: true })} />
        {errors.commentText && <span>This field is required</span>}

        <button type="submit">Post!</button>
      </Column>
    </form>
  )
}

const TopicPage = ({ thread, initialComments }: { thread: Thread; initialComments: Comment[] }) => {
  const [createThreadFormIsOpen, setCreateThreadFormIsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>(initialComments)

  const updateComments = useCallback(async () => {
    const _comments: Comment[] = (await axios.get<ReturnType>(`/api/comments?thread=${thread.id}`)).data.comments
    setComments(_comments)
  }, [thread])

  return (
    <div className={styles['forum-container']}>
      <h2>{thread.title}</h2>
      {comments &&
        comments.map((comment: Comment) => {
          return (
            <div className={styles['forum-item']} key={comment.id}>
              <h3 className={styles['forum-item-title']}>{comment.authorDisplayName}</h3>
              <p>{comment.text}</p>
            </div>
          )
        })}

      <ExtendableIconButton icon={faAdd} onClick={() => setCreateThreadFormIsOpen(true)} text="Add Comment" />
      {createThreadFormIsOpen && <AddCommentForm onSubmit={updateComments} threadId={thread.id} />}
    </div>
  )
}

TopicPage.getInitialProps = async (context: NextPageContext) => {
  const threadId = context.query['thread-id'] as string

  const response = (await axios.get<ReturnType>(`${process.env.APP_BASE_URL}/api/comments?thread=${threadId}`))
    .data
  const initialComments = response.comments
  const {title} = response.thread

  return {
    thread: {
      id: threadId,
      title,
    },
    initialComments,
  }
}

export default TopicPage
