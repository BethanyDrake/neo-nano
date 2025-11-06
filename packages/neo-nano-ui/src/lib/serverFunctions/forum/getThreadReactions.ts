'use server'
import { Dictionary } from "lodash"
import { getQueryFunction } from "../_utils/getQueryFunction"


type RawResponse = {
  comment_id: string,
  reaction: 'like',
  reacted_users: string[]
}

export type CommentReactions = {
  like?: string[]
}

export const getThreadReactions = async (threadId: string) => {
      const sql = getQueryFunction()
const rawReactions = (await sql`select comment_reactions.comment_id, comment_reactions.reaction, jsonb_agg_strict(user_id) as reacted_users
  from comment_reactions JOIN comments on comments.id = comment_reactions.comment_id
  where comments.thread=${threadId}
group by comment_reactions.reaction , comment_reactions.comment_id`) as RawResponse[]

const reactions: Dictionary<CommentReactions> = {};

rawReactions.forEach(({comment_id, reaction, reacted_users}) => {
  if (!reactions[comment_id]) {
    reactions[comment_id] = {}
  }

  reactions[comment_id][reaction] = reacted_users.map((id) => `${id}`)
})

return reactions
}


