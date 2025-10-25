import { CSSProperties, PropsWithChildren } from "react"

type Props = PropsWithChildren & Pick<CSSProperties, 'gap'| 'justifyContent' | 'alignItems'> & {style?: CSSProperties}

export const LeftRow = ({children, gap, alignItems, style}: Props) => {
  return (
  <div style={{display:"flex", flexDirection:"row", alignItems, justifyContent: "left", gap: gap ?? '1em', ...(style ?? {})}}>{children}</div>)
}


export const Row = ({children, gap, justifyContent, alignItems, style}: Props) => {
  return (
  <div style={{display:"flex", flexDirection:"row", alignItems, justifyContent: justifyContent ?? "center", gap: gap ?? '1em', ...(style ?? {})}}>{children}</div>)
}

export const Column = ({children, gap, style}: Pick<Props, 'children' | 'gap' | 'style'| 'alignItems'>) => {
  return (
  <div style={{display:"flex", flexDirection:"column", justifyContent: "center", gap: gap ?? '1em', ...(style?? {})}}>{children}</div>)
}

export const Centered = ({children, style}: Pick<Props, 'children' | 'style'>) => {
  return (
  <div style={{display:"flex", flexDirection:"row", justifyContent: "center", ...(style?? {})}}>{children}</div>)
}
