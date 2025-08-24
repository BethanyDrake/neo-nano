import { ReturnType } from "@/app/api/threads/route"
import { Thread } from "@/lib/forum.types"
import { Column } from "@/lib/layout"
import axios from "axios"
import { NextPageContext } from "next"
import { useCallback, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  title: string
  commentText: string
}

type Topic = {
    id: string
    title: string
    description: string
}
type ThreadSummary = {
    id: string
    title: string
}

const CreateThreadForm = ({topicId, onSubmit}: {topicId: string, onSubmit: () => void}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

const _onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
  const body = {
    ...data,
    topic: topicId
  }
  await axios.post(`/api/threads`, body).then(() => {
    reset()
    onSubmit()
})

}


     return (
    <form onSubmit={handleSubmit(_onSubmit)}>
        <Column>
      <input placeholder="Thread Title" {...register("title")} required={true} />

      {errors.title && <span>This field is required</span>}
      <input {...register("commentText", { required: true })} />
      {errors.commentText && <span>This field is required</span>}

      <input type="submit" />
      </Column>
    </form>
  )
}



const TopicPage = ({topic, initialThreads}:{topic: Topic, initialThreads:Thread[]}) => {
    const [createThreadFormIsOpen, setCreateThreadFormIsOpen] = useState(false);
    const [threads, setThreads] = useState<Thread[]>(initialThreads)

    console.log({threads})
    const updateThreads = useCallback(async () => {

      const _threads: Thread[] = (await axios.get<ReturnType>(`/api/threads?topic=${topic.id}`)).data.threads
        console.log({_threads})
      setThreads(_threads)
    }, [topic])

    
    return(<>
        <div>{topic.id}</div>
        {
           threads && threads.map((thread:ThreadSummary) => {
            return <div key={thread.id}>{thread.title}</div>
           })
        }
        <button role="button" onClick={() => setCreateThreadFormIsOpen(true)}>Create Thread</button>
        {createThreadFormIsOpen &&<CreateThreadForm onSubmit={updateThreads} topicId={topic.id} />}
        </>)
}

TopicPage.getInitialProps =  async (context: NextPageContext)  => {
    const topicId = context.query["topic-id"] as string
    console.log('url', `/api/threads?topic=${topicId}`)
    const initialThreads = (await axios.get<ReturnType>(`${process.env.APP_BASE_URL}/api/threads?topic=${topicId}`)).data.threads

    return {
        topic: {
            id: topicId,
            title: "Topic Title",
            description: "topic description"
        },
        initialThreads
    }

}

export default TopicPage