'use client'
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

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
