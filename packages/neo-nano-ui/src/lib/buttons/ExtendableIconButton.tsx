import { DOMAttributes } from "react"
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome"
import styles from './ExtendableIconButton.module.css'
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner"

export const ExtendableIconButton = ({text, onClick, icon, isLoading}: {text:string, isLoading?: boolean} & Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> & Pick<FontAwesomeIconProps, 'icon'>) => {
    if (isLoading) return <button className={styles["icon-button"]}><FontAwesomeIcon spin icon={faSpinner} /><span>{text}</span></button>
    return <button className={styles["icon-button"]} onClick={onClick}><FontAwesomeIcon icon={icon} /><span>{text}</span></button>
}

export const SmallIconButton = ({text, onClick, icon, isLoading}: {text:string, isLoading?: boolean, variant?: 'secondary'} & Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> & Pick<FontAwesomeIconProps, 'icon'>) => {
    if (isLoading) return <button className={styles["small-icon-button"]}><FontAwesomeIcon spin icon={faSpinner} /></button>
    return <button aria-labelledby="tooltip-text" className={styles["small-icon-button"]} onClick={onClick}><FontAwesomeIcon icon={icon} /><p id="tooltip-text" className={styles['tooltip']}>{text}</p></button>
}