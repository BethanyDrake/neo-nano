import { DOMAttributes } from "react"
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome"
import styles from './ExtendableIconButton.module.css'

export const ExtendableIconButton = ({text, onClick, icon}: {text:string} & Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> & Pick<FontAwesomeIconProps, 'icon'>) => {
 return <button className={styles["icon-button"]} onClick={onClick}><FontAwesomeIcon icon={icon} /><span>{text}</span></button>
}