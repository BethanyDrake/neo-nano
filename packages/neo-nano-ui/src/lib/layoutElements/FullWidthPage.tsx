import { PropsWithChildren } from "react"

export const FullWidthPage = ({children}:PropsWithChildren)  => {
   return (<main style={{padding: '32px'}}>{children}</main>)
}