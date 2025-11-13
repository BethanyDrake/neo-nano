
"use client"
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react'

export const ClientSideOnly = ({children, fallback}: PropsWithChildren & {fallback?: ReactNode})  => {
  const [isInitialRender, setIsInitialRender] = useState(true)
  useEffect(() => {
    setIsInitialRender(false)
  }, [])

  if (isInitialRender) return fallback ?? null;
  return children
}