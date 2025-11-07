'use server'

import { Thread } from "../../forum.types"
import { getQueryFunction } from "../_utils/getQueryFunction"
import { getThreads } from "./getThreads"
import { getUserId } from "../_utils/getUserIdFromSession"

export type CreateThreadPayload = Pick<Thread, 'title'> & {topic: string, commentText: string, commentRichText: string }

export const createThread = async ({title, topic, commentText, commentRichText}: CreateThreadPayload) => {
    console.log('createThread', title)
    const sql = getQueryFunction()
    const userId = await getUserId()

    const res = await sql`INSERT INTO threads (title, author, topic) 
        VALUES (${title}, ${userId}, ${topic})
        RETURNING id`

    const createdThreadId = res[0].id

    await sql`INSERT INTO comments (comment_text, author, thread, rich_text) 
        VALUES (${commentText}, ${userId}, ${createdThreadId}, ${commentRichText})
        RETURNING id`

    const result = await getThreads(topic)
    return result

}