import { CSSProperties, PropsWithChildren } from "react"

export const Row = ({children, gap, justifyContent}: PropsWithChildren & Pick<CSSProperties, 'gap'| 'justifyContent'>) => {
  return (
  <div style={{display:"flex", flexDirection:"row", justifyContent: justifyContent ?? "center", gap: gap ?? '1em'}}>{children}</div>)
}

export const Column = ({children, gap}: PropsWithChildren & Pick<CSSProperties, 'gap'>) => {
  return (
  <div style={{display:"flex", flexDirection:"column", justifyContent:"center", gap: gap ?? '1em'}}>{children}</div>)
}

export const Centered = ({children}: PropsWithChildren) => {
  return (
  <div style={{display:"flex", flexDirection:"row", justifyContent: "center"}}>{children}</div>)
}
