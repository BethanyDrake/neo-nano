 "use client"

import { ButtonHTMLAttributes, DetailedHTMLProps, PropsWithChildren, useCallback, useState } from "react"
import classes from './BasicButton.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner"
import { useLoadableOnClick } from "./usLoadableOnClick"

export const BasicButton = ({buttonProps, children, variant, isLoading}: PropsWithChildren & {isLoading?: boolean, variant?: 'angry', buttonProps?: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>} ) => {
    const content = isLoading ? <FontAwesomeIcon spin={true} icon={faSpinner} /> : children
    
    return <button className={[classes["basic-button"], classes[variant ?? 'basic']].join(' ')}{...buttonProps}>{content}</button>
}

/**Button that handles its own loading state */
export const LoadingButton = ({onClick, children, variant}: PropsWithChildren & {variant?: 'angry', onClick: () => Promise<unknown>} ) => {

    const {isLoading, onClick: _onClick } = useLoadableOnClick(onClick)
    
    return <BasicButton buttonProps={{onClick: _onClick}} isLoading={isLoading} variant={variant}>{children}</BasicButton>
   }
