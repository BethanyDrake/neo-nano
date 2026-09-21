import { CSSProperties, PropsWithChildren } from "react";

export const InfoBubble = ({title, children, style}: PropsWithChildren &{title: string, style: CSSProperties}) => {
    return  <div style={{height: 'fit-content',padding: '16px', border: '4px solid var(--secondary-vibrant)', borderRadius: '10px', maxWidth:'350px', ...style}}>
        <h2 style={{textAlign:'center', padding: 0, paddingBottom: '10px'}}>{title}</h2>
        {children}
      </div>
}