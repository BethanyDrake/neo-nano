"use client"
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";
import { CommentCardDataEntry } from "./CommentCard";
import { getThreadWithComments } from "./serverFunctions/forum/getThreadWithComments";

export const ThreadContext = createContext<
{
    updateCommentsData: () => Promise<void>
    commentsData: CommentCardDataEntry[]
}>({
    updateCommentsData: () => Promise.resolve(),
    commentsData: []
})

export const useThreadContext = () => useContext(ThreadContext)

export const ThreadContextProvider = ({initialComments, children, threadId}: PropsWithChildren & {initialComments: CommentCardDataEntry[], threadId: string}) => {
    const [commentCards, setComments] = useState<CommentCardDataEntry[]>(initialComments)

  const updateComments = useCallback(async () => {
    const _comments: CommentCardDataEntry[] = (await getThreadWithComments(threadId)).commentCardDataEntries
    setComments(_comments)
  }, [threadId])

    const value = useMemo(() => {
        return { updateCommentsData: updateComments, commentsData: commentCards }
    }, [commentCards, updateComments])

    return (    <ThreadContext value={value}>{children}</ThreadContext>)


}