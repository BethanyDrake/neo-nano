
"use client"
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import { getIsModerator } from '@/lib/serverFunctions/moderation/getIsModerator'

export const ModeratorOnly = ({children, fallback}: PropsWithChildren & {fallback?: ReactNode})  => {
  const [isModerator, setIsModerator] = useState(false)
  useEffect(() => {
    getIsModerator().then(setIsModerator)
  }, [])

  if (isModerator) {
    return children
  }

  return fallback ?? null;
}