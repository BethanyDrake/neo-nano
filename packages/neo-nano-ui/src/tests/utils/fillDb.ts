import { getQueryFunction } from "@/lib/serverFunctions/_utils/getQueryFunction"
import { Category, Comment, CommentSnapshot, Flag, Profile, Thread, Topic } from "@/lib/types/forum.types"
import { randomUUID } from "node:crypto"

export const addUser = async (overrides: Partial<Profile> = {}, external_id?: string ): Promise<string> => {
    const rows = await getQueryFunction()`
        INSERT INTO users (external_id, display_name, role)
        VALUES (${ external_id ?? randomUUID()}, ${overrides.displayName}, ${overrides.role ?? 'user'})
        RETURNING users.id
    `
    return rows[0].id
}

export const GENERAL_CATEGORY = 'general-category'
export const addCategory = async (overrides: Partial<Category> = {}) => {
    await getQueryFunction()`insert into categories (id, title) values 
        (${overrides.id ?? GENERAL_CATEGORY}, ${overrides.title});`
}

export const GENERAL_TOPIC = 'general-topic'


export const addTopic = async (overrides: Partial<Topic> = {})=> {
   await getQueryFunction()`
       insert into topics (id, title, description, icon, category) values 
        (${overrides.id ?? GENERAL_TOPIC}, ${overrides.title}, ${overrides.description}, ${overrides.icon}, ${overrides.category ?? GENERAL_CATEGORY});
    `
}

export const addThread = async (overrides: Partial<Thread> = {}): Promise<string> => {
    const rows = await getQueryFunction()`INSERT INTO threads (title, author, topic) 
        VALUES (${overrides.title}, ${overrides.author}, ${overrides.topic ?? GENERAL_TOPIC})
        returning id`

    return rows[0].id
}

export const addComment= async (thread: string, overrides: Partial<Comment> = {}, ): Promise<string> => {
    const rows = await getQueryFunction()`INSERT INTO comments (comment_text, author, thread, rich_text) 
      VALUES (${overrides.text}, ${overrides.author}, ${thread}, ${overrides.richText})
        returning id`

    return rows[0].id
}

export const addCommentSnapshot = async (commentId: string, overrides: Partial<CommentSnapshot> = {}, ): Promise<string> => {
    const rows = await getQueryFunction()`INSERT INTO comment_snapshots (snapshot_of, version, comment_text, rich_text, posted_at)
      VALUES (${commentId}, ${overrides.version}, ${overrides.text}, ${overrides.richText}, ${overrides.postedAt ?? new Date()})
        returning id`

    return rows[0].id
}

export const addLike= async (commentId: string, userId: string) => {
    await getQueryFunction()`INSERT INTO comment_reactions (comment_id, user_id, reaction) 
      VALUES (${commentId}, ${userId}, 'like')`
}

export const addFlag= async (commentId: string, overrides: Partial<Flag> = {}, ): Promise<string> => {
    const rows = await getQueryFunction()`insert into flags (comment, reported_by, reason, details) values 
(${commentId}, ${overrides.reportedBy}, ${overrides.reason}, ${overrides.details})
        returning id`

    return rows[0].id
}




