"use client"
import { ReturnType } from '@/app/api/comments/route'
import { Breadcrumbs } from '@/lib/Breadcrumbs'
import { ExtendableIconButton } from '@/lib/buttons/ExtendableIconButton'
import { Category, Thread, Topic } from '@/lib/forum.types'
import { Column } from '@/lib/layout'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import styles from '@/lib/styles/forum.module.css'
import formClasses from '@/lib/form.module.css'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { redirect } from 'next/navigation'
import { CommentCard, CommentCardDataEntry } from '@/lib/CommentCard'

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

export const ThreadPage = ({
  thread,
  topic,
  category,
  initialComments,
  isLoggedIn
}: {
  thread: Thread
  topic: Topic
  category: Category
  initialComments: CommentCardDataEntry[]
  isLoggedIn: boolean
}) => {
  const [createThreadFormIsOpen, setCreateThreadFormIsOpen] = useState(false)
  const [commentCards, setComments] = useState<CommentCardDataEntry[]>(initialComments)

  const updateComments = useCallback(async () => {
    const _comments: CommentCardDataEntry[] = (await axios.get<ReturnType>(`/api/comments?thread=${thread.id}`)).data.commentCardDataEntries
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
          {commentCards &&
            commentCards.map(({comment, author}) => <CommentCard key={comment.id} comment={comment} author={author}/>)}
        </div>
        <ExtendableIconButton icon={faAdd} onClick={() => isLoggedIn? setCreateThreadFormIsOpen(true) : redirect('/auth/login')} text="Add Comment" />
        {createThreadFormIsOpen && <AddCommentForm onSubmit={updateComments} threadId={thread.id} />}
      </Column>
    </div>
  )
}
