"use client"

import { Breadcrumbs } from '@/lib/Breadcrumbs'
import { BasicButton } from '@/lib/buttons/BasicButton'
import { ExtendableIconButton } from '@/lib/buttons/ExtendableIconButton'
import { useTopicContext } from '@/lib/context/TopicContext'
import formClasses from '@/lib/form.module.css'
import { Category } from '@/lib/forum.types'
import { Column, Row } from '@/lib/layout'
import { THREADS_PER_PAGE } from '@/lib/misc'
import RichTextEditor from '@/lib/richText/RichTextEditor'
import { ThreadSummary } from '@/lib/serverFunctions/forum/getThreads'
import styles from '@/lib/styles/forum.module.css'
import { ThreadCard } from '@/lib/ThreadCard'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { redirect, usePathname } from 'next/navigation'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type Inputs = {
  title: string
  commentText: string
}

type Topic = {
  id: string
  title: string
  description: string
}

const CreateThreadForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()
   const [richText, setRichText] = useState('')
    const [plainText, setPlainText] = useState('')
    const [errorText, setErrorText] = useState('')

    const { createThread, isLoading } = useTopicContext()

  const _onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    if (!plainText.trim()) {
      setErrorText("Can't post an empty comment.")
      return
    }
    const body = {
      ...data,
      commentRichText: richText,
      commentText: plainText
    }
    createThread(body).then(() => {
      reset()
      onSubmit()
      setRichText('')
      setPlainText('')
    })
  }

  return (
    <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
      <Row alignItems='center' justifyContent='left'>
        <label htmlFor="title">Title:</label>
        <input id="title" placeholder="Thread Title" {...register('title', {required: true})}/>
        </Row>

        {errors.title && <span className={formClasses.error}>^Please enter a title. This should be a short description of what you want to say.</span>}
        <label htmlFor="comment">Comment:</label>
        <RichTextEditor setValue={setRichText} value={richText} setPlainText={setPlainText} />
        {errorText && <span  className={formClasses.error}>^Please enter a comment to start the conversion.</span>}
        
        <BasicButton isLoading={isLoading} buttonProps={{type:"submit"}}>Post!</BasicButton>
      </Column>
    </form>
  )
}

const TopicPage = ({
  topic,
  category,
  isLoggedIn
}: {
  topic: Topic
  category: Category
  isLoggedIn: boolean
}) => {
  const [createThreadFormIsOpen, setCreateThreadFormIsOpen] = useState(false)
  const { threadsData: threads, onPageChange, currentPage, totalThreads, isLoading } = useTopicContext()

  const onCreateThread = useCallback(async () => {
    setCreateThreadFormIsOpen(false)
  }, [])
  const pathname = usePathname()

  const breadcrumbItems = [{href: '/forum', text: category.title}, {text: topic.title} ]
  return (
    <div className={styles['forum-container']}>
      <Column>
      <Row justifyContent="space-between">
      <Breadcrumbs breadcrumbItems={breadcrumbItems} />
       <Pagination
            pageSize={THREADS_PER_PAGE}
            onChange={onPageChange}
            current={currentPage}
            total={totalThreads}
            disabled={isLoading}
          />
      </Row>
        <p>{topic.description}</p>
        <ExtendableIconButton icon={faAdd} onClick={() => 
          isLoggedIn? setCreateThreadFormIsOpen(true) : redirect(`/auth/login?returnTo=${pathname}`)
        } text="Create Thread" />
        {createThreadFormIsOpen && <CreateThreadForm onSubmit={onCreateThread} />}
        <Column>
          <h2>Threads:</h2>
          {threads &&
            threads.map((thread: ThreadSummary) => <ThreadCard key={thread.id} topicId={topic.id} thread={thread}/>)}
        </Column>
      </Column>
    </div>
  )
}

export default TopicPage
