
"use client"
import { PropsWithChildren, useEffect, useState } from 'react'

export const ClientSideOnly = ({children}: PropsWithChildren)  => {
  const [isInitialRender, setIsInitialRender] = useState(true)
  useEffect(() => {
    setIsInitialRender(false)
  }, [])

  if (isInitialRender) return null;
  return children
}