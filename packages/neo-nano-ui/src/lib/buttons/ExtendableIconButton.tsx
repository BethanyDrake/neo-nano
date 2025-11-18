import { DOMAttributes } from "react"
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome"
import styles from './ExtendableIconButton.module.css'
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner"
import { faHeart } from "@fortawesome/free-solid-svg-icons"

export const ExtendableIconButton = ({text, onClick, icon, isLoading}: {text:string, isLoading?: boolean} & Pick<DOMAttributes<HTMLButtonElement>, 'onClick'> & Pick<FontAwesomeIconProps, 'icon'>) => {
    if (isLoading) return <button disabled title={text} className={styles["icon-button"]}><FontAwesomeIcon spin icon={faSpinner} /><span>{text}</span></button>
    return <button title={text} className={styles["icon-button"]} onClick={onClick}><FontAwesomeIcon icon={icon} /><span>{text}</span></button>
}

type SmallIconButtonProps = 
    {id: string, text:string, isLoading?: boolean, variant?: 'angry'} & Pick<DOMAttributes<HTMLButtonElement>, 'onClick' > & Pick<FontAwesomeIconProps, 'icon'>


export const SmallIconButton = ({id, text, onClick, icon, isLoading, variant}:SmallIconButtonProps ) => {
    const classNames = variant? [styles["small-icon-button"], styles[variant]]  : [styles["small-icon-button"]]
    if (isLoading) return <button className={classNames.join(' ')}><FontAwesomeIcon spin icon={faSpinner} /></button>
    return <button aria-labelledby={`tooltip-text-${id}`} className={classNames.join(' ')} onClick={onClick}><FontAwesomeIcon icon={icon} /><p id={`tooltip-text-${id}`} className={styles['tooltip']}>{text}</p></button>
}

export const ReactionButton = ({disabled, onClick, isLoading, isActive}:Pick<SmallIconButtonProps, 'onClick' | 'isLoading'>& {isActive: boolean, disabled: boolean}) => {
    const text = 'like'
    const id="like"
    const _styles = [styles["small-icon-button"], styles['likeButton']]
    if (isActive) _styles.push(styles['isActive'])
    if (isLoading) return <button className={_styles.join(' ')}><FontAwesomeIcon spin icon={faSpinner} /></button>
    return <button disabled={disabled} aria-labelledby={`tooltip-text-${id}`} className={_styles.join(' ')}  onClick={onClick}><FontAwesomeIcon icon={faHeart} /><p id={`tooltip-text-${id}`} className={styles['tooltip']}>{text}</p></button>
}