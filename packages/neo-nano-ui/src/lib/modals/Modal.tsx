import { useModalContext } from "./ModalContext"
import modalStyles from './Modal.module.css'
import { PropsWithChildren } from "react"

type ModalVariant = 'secondary' |'angry'

export const Modal = ({children, modalId, variant}: PropsWithChildren & {modalId: string, variant?: ModalVariant}) => {
  const { openModal, closeModal } = useModalContext()
  const isOpen = openModal === modalId


  if (!isOpen) return null
  return (<>
        <div className={[modalStyles.modal, modalStyles[variant ?? '']].join(' ')}>
          {children}
          </div>
    <div onClick={closeModal} className={[modalStyles['modal-overlay'], modalStyles[variant ?? '']].join(' ')} />
      </>)

}