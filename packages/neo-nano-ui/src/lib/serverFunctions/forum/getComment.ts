import { Comment } from "@/lib/types/forum.types"
import { getQueryFunction } from "../_utils/getQueryFunction"
import { getSingle } from "../_utils/getSingle"
import { mapComment, RawComment } from "./rowMappers"

export const getComment = async (id: string): Promise<Comment> => {
    return mapComment(
        await getSingle('Comment', getQueryFunction()`select * from comments where id=${id}`) as RawComment)

}