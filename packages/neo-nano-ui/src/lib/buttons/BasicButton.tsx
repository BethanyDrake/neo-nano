import { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from "react"
import classes from './BasicButton.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner"

export const BasicButton = ({buttonProps, children, variant, isLoading}: PropsWithChildren & {isLoading?: boolean, variant?: 'angry', buttonProps?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>} ) => {
    const content = isLoading ? <FontAwesomeIcon spin={true} icon={faSpinner} /> : children
    
    return <button className={[classes["basic-button"], classes[variant ?? 'basic']].join(' ')}{...buttonProps}>{content}</button>
}