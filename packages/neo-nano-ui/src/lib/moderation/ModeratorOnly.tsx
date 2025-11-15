
"use client"
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import { getIsModerator } from '../serverFunctions/moderation/getIsModerator'

export const ModeratorOnly = ({children, fallback}: PropsWithChildren & {fallback?: ReactNode})  => {
  const [isModerator, setIsModerator] = useState(false)
  useEffect(() => {
    getIsModerator().then(setIsModerator)
  }, [])

  if (isModerator) return fallback ?? null;
  return children
}