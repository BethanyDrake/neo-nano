import { CSSProperties, PropsWithChildren } from "react"

export const LeftRow = ({children, gap, alignItems}: PropsWithChildren & Pick<CSSProperties, 'gap'| 'justifyContent' | 'alignItems'>) => {
  return (
  <div style={{display:"flex", flexDirection:"row", alignItems, justifyContent: "left", gap: gap ?? '1em'}}>{children}</div>)
}


export const Row = ({children, gap, justifyContent, alignItems}: PropsWithChildren & Pick<CSSProperties, 'gap'| 'justifyContent' | 'alignItems'>) => {
  return (
  <div style={{display:"flex", flexDirection:"row", alignItems, justifyContent: justifyContent ?? "center", gap: gap ?? '1em'}}>{children}</div>)
}

export const Column = ({children, gap}: PropsWithChildren & Pick<CSSProperties, 'gap'>) => {
  return (
  <div style={{display:"flex", flexDirection:"column", justifyContent:"center", gap: gap ?? '1em'}}>{children}</div>)
}

export const Centered = ({children}: PropsWithChildren) => {
  return (
  <div style={{display:"flex", flexDirection:"row", justifyContent: "center"}}>{children}</div>)
}
