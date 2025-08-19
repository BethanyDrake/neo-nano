import { NextPageContext } from "next"

type Topic = {
    id: string
    title: string
    description: string
}
type ThreadSummary = {
    id: string
    title: string
    description: string
}

const TopicPage = ({topic, threads}:{threads: ThreadSummary[], topic: Topic}) => {
    return(<><div>{topic.id}</div><div>{threads.length}</div></>)
}

TopicPage.getInitialProps =  (context: NextPageContext)  => {
    const topicId = context.query["topic-id"]

    return {
        topic: {
            id: topicId,
            title: "Topic Title",
            description: "topic description"
        },
        threads: []
    }

}

export default TopicPage