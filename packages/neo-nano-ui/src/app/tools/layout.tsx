import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: 'Toolbox',
  description: 'Tools for writing, staying focussed, and tracking your progress.'
}

const ToolboxLayout = ({children}: PropsWithChildren) => {return <>{children}</>}
export default ToolboxLayout