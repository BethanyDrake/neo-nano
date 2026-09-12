

'use client'

import { useEffect, useState } from "react"


export const setPreviouslySeenComments = (threadId: string, numberOfComments: number) => {
    window.localStorage.setItem(`thread.${threadId}.comments`, numberOfComments.toString())
  }


export const usePreviouslySeenThreadComments = (threadId: string) => {
  const [value, setValue] = useState(0)
  useEffect(() => {
   const  s = window.localStorage.getItem(`thread.${threadId}.comments`)
    if (s) {
      Promise.resolve().then(() => setValue(parseInt(s)))
    }
  }, [threadId])

  return value

}
export const setPreviouslySeenTopicComments = (topicId: string, numberOfComments: number) => {
    window.localStorage.setItem(`topic.${topicId}.comments`, numberOfComments.toString())
  }


export const getPreviouslySeenTopicComments = (topicId: string) => {
const s = window.localStorage.getItem(`topic.${topicId}.comments`)
return s ? parseInt(s) : 0
}

export const setPreviouslySeenTopicThreads = (topicId: string, numberOfThreadss: number) => {
    window.localStorage.setItem(`topic.${topicId}.threads`, numberOfThreadss.toString())
  }


export const usePreviouslySeenTopicThreads = (topicId: string) => {
  const [value, setValue] = useState(0)
  useEffect(() => {
   const  s = window.localStorage.getItem(`topic.${topicId}.threads`)
    if (s) {
      Promise.resolve().then(() => setValue(parseInt(s)))
    }
  }, [topicId])

  return value

}


