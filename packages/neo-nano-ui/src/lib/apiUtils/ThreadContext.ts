import { createContext, useContext } from "react";
import { CommentCardDataEntry } from "../CommentCard";

export const ThreadContext = createContext<
{
    updateCommentsData: () => Promise<void>
    commentsData: CommentCardDataEntry[]
}>({
    updateCommentsData: () => Promise.resolve(),
    commentsData: []
})

export const useThreadContext = () => useContext(ThreadContext)