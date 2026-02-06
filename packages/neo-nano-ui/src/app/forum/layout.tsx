import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: 'Forum',
  description: 'A place to chat, share your progress, or ask for help from other writers.'
}

const ForumLayout = ({children}: PropsWithChildren) => {return <>{children}</>}
export default ForumLayout