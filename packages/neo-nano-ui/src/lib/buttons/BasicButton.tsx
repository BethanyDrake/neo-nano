import { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from "react"
import classes from './BasicButton.module.css'

export const BasicButton = ({buttonProps, children, variant}: PropsWithChildren & {variant?: 'angry', buttonProps?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>} ) => {
    return <button className={[classes["basic-button"], classes[variant ?? 'basic']].join(' ')}{...buttonProps}>{children}</button>
}