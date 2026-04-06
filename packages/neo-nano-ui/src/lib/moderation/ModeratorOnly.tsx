
"use client"
import { PropsWithChildren, ReactNode} from 'react'
import { getIsModerator } from '@/lib/serverFunctions/moderation/getIsModerator'
import { useQuery } from '@tanstack/react-query'

export const ModeratorOnly = ({children, fallback}: PropsWithChildren & {fallback?: ReactNode})  => {
  const {data: isModerator} = useQuery({queryKey: ['isModerator'], queryFn: getIsModerator })

  if (isModerator) {
    return children
  }

  return fallback ?? null;
}