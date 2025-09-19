'use server'

import { Thread } from "../forum.types"
import { getQueryFunction } from "./getQueryFunction"
import { getThreads } from "./getThreads"
import { getUserId } from "./getUserIdFromSession"

export const createThread = async ({title, topic, commentText}: Pick<Thread, 'title'> & {topic: string, commentText: string}) => {
    console.log("create thread")
    const sql = getQueryFunction()
    const userId = await getUserId()

    const res = await sql`INSERT INTO threads (title, author, topic) 
        VALUES (${title}, ${userId}, ${topic})
        RETURNING id`

    const createdThreadId = res[0].id

    await sql`INSERT INTO comments (comment_text, author, thread) 
        VALUES (${commentText}, ${userId}, ${createdThreadId})
        RETURNING id`

    const result = await getThreads(topic)
    console.log('create threads done', result)
    return result

}