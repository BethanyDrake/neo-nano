'use client'
import confetti from 'canvas-confetti'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import { BasicButton } from '../buttons/BasicButton'
import { Column } from '../layoutElements/flexLayouts'
import { UserAward } from '../profile.types'
import classNames from './awards.module.css'
import { Trophy } from './Trophy'

export const NewAwardModalContext = createContext<{
  award?: UserAward
  isOpen: boolean
  displayNewAward: (award: UserAward) => void
  closeModal: () => void
}>({
  award: undefined,
  isOpen: false,
  displayNewAward: () => {},
  closeModal: () => {},
})

export const NewAwardModalProvider = ({ children }: PropsWithChildren) => {
  const [award, setAward] = useState<UserAward>()
  const [isOpen, setIsOpen] = useState(false)

  const displayNewAward = useCallback((_award: UserAward) => {
    setIsOpen(true)
    setAward(_award)
    confetti({
      disableForReducedMotion: true,
      zIndex: 1050,
      spread: 90,
      colors: ['#C0E5C8', '#1ab394', '#6e1ab3', '#d8a9ffff'],
    })
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setAward(undefined)
  }, [])

  const value = useMemo(() => {
    return { award, isOpen, displayNewAward, closeModal }
  }, [award, isOpen, displayNewAward, closeModal])

  return <NewAwardModalContext.Provider value={value}>{children}</NewAwardModalContext.Provider>
}

export const NewAwardModal = () => {
  const { award, isOpen, closeModal } = useContext(NewAwardModalContext)
  if (!isOpen || !award) {
    return null
  }

  return (
    <div className={classNames['modal-overlay']}>
      <div className={classNames.modal}>
        <Column>
          <Trophy award={award} />
          <BasicButton buttonProps={{ onClick: closeModal }}>Accept Trophy</BasicButton>
        </Column>
      </div>
    </div>
  )
}
