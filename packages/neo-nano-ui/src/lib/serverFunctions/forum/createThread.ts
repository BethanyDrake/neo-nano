'use server'

import { Thread } from "@/lib/types/forum.types"
import { getQueryFunction } from "../_utils/getQueryFunction"
import { getUserId } from "../_utils/getUserIdFromSession"
import { autoReviewComment } from "../moderation/autoReviewComment"

export type CreateThreadPayload = Pick<Thread, 'title'> & {topic: string, commentText: string, commentRichText: string }

export const createThread = async ({title, topic, commentText, commentRichText}: CreateThreadPayload) => {
    console.log('createThread', title)
    const sql = getQueryFunction()
    const userId = await getUserId()

    const res = await sql`INSERT INTO threads (title, author, topic) 
        VALUES (${title}, ${userId}, ${topic})
        RETURNING id`

    const createdThreadId = res[0].id

    const commentRows = await sql`INSERT INTO comments (comment_text, author, thread, rich_text) 
        VALUES (${commentText}, ${userId}, ${createdThreadId}, ${commentRichText})
        RETURNING id`

    const createdCommentId = commentRows[0].id
    await autoReviewComment(createdCommentId, commentText)

    return createdThreadId

}