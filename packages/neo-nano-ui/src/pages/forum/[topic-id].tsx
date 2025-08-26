import { ReturnType } from '@/app/api/threads/route'
import { Thread } from '@/lib/forum.types'
import { Column } from '@/lib/layout'
import axios from 'axios'
import { NextPageContext } from 'next'
import { useCallback, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import styles from './index.module.css'
import { ExtendableIconButton } from '@/lib/buttons/ExtendableIconButton'

type Inputs = {
  title: string
  commentText: string
}

type Topic = {
  id: string
  title: string
  description: string
}

const CreateThreadForm = ({ topicId, onSubmit }: { topicId: string; onSubmit: () => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const _onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    const body = {
      ...data,
      topic: topicId,
    }
    await axios.post(`/api/threads`, body).then(() => {
      reset()
      onSubmit()
    })
  }

  return (
    <form onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        <label htmlFor="title">Title</label>
        <input id="title" placeholder="Thread Title" {...register('title')} required={true} />

        {errors.title && <span>This field is required</span>}
        <label htmlFor="comment">Comment</label>
        <input id="comment" {...register('commentText', { required: true })} />
        {errors.commentText && <span>This field is required</span>}

        <button type="submit">Post!</button>
      </Column>
    </form>
  )
}

const TopicPage = ({ topic, initialThreads }: { topic: Topic; initialThreads: Thread[] }) => {
  const [createThreadFormIsOpen, setCreateThreadFormIsOpen] = useState(false)
  const [threads, setThreads] = useState<Thread[]>(initialThreads)

  const updateThreads = useCallback(async () => {
    const _threads: Thread[] = (await axios.get<ReturnType>(`/api/threads?topic=${topic.id}`)).data.threads
    setThreads(_threads)
  }, [topic])

  return (
    <main>
      <div className={styles['forum-container']}>
      <h2>{topic.title}</h2>
      {threads &&
        threads.map((thread: Thread) => {
          return <a href={`/forum/${topic.id}/${thread.id}`} className={styles['thread']} key={thread.id}><h3 className={styles['forum-item-title']} >{thread.title}</h3><p>
            Truncated comment text...</p></a>
        })}

<ExtendableIconButton onClick={() => setCreateThreadFormIsOpen(true)} text="Create Thread" />
      {createThreadFormIsOpen && <CreateThreadForm onSubmit={updateThreads} topicId={topic.id} />}
      </div>
    </main>
  )
}

TopicPage.getInitialProps = async (context: NextPageContext) => {
  const topicId = context.query['topic-id'] as string
  const initialThreads = (await axios.get<ReturnType>(`${process.env.APP_BASE_URL}/api/threads?topic=${topicId}`)).data
    .threads

  return {
    topic: {
      id: topicId,
      title: 'Topic Title',
      description: 'topic description',
    },
    initialThreads,
  }
}

export default TopicPage
