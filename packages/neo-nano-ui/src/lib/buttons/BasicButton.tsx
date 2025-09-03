import { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren } from "react"
import classes from './BasicButton.module.css'

export const BasicButton = ({buttonProps, children}: PropsWithChildren & {buttonProps?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>} ) => {
    return <button className={classes["basic-button"]}{...buttonProps}>{children}</button>
}