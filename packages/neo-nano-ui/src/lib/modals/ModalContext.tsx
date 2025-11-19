'use client'
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import modalStyles from './Modal.module.css'

const ModalContext = createContext<{ openModal: string | null; setOpenModal: (modalName: string) => void; closeModal: () => void }>({
  openModal: null,
  setOpenModal: () => {},
  closeModal: () => {},
})

export const useModalContext = () => useContext(ModalContext)

export const ModalContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [openModal, setOpenModal] = useState<string | null>(null)

  const value = useMemo(() => {
    return { openModal, setOpenModal, closeModal: () => setOpenModal(null) }
  }, [openModal])

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

export const ModalOverlay = () => {
  const {openModal, closeModal} = useModalContext()
  if (openModal !== null) {
    return <div onClick={closeModal} className={modalStyles['modal-overlay']} /> 
  }
  return null
}
