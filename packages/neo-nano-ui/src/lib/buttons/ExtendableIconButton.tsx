import { DOMAttributes } from "react"
import * as Icons from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from './ExtendableIconButton.module.css'
import { Row } from "../layout"

export const ExtendableIconButton = ({text, onClick}: {text:string} & Pick<DOMAttributes<HTMLButtonElement>, 'onClick'>) => {
 return <button className={styles["icon-button"]} onClick={onClick}><FontAwesomeIcon icon={Icons.faAdd} /><span>{text}</span></button>
}