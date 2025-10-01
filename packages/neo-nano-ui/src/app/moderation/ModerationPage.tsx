"use client"
import RichTextDisplay from "@/lib/richText/RichTextDisplay"
import { CommentFlag } from "@/lib/serverFunctions/moderation/getFlaggedComments"
import cardStyles from '@/lib/CommentCard.module.css'

export const ModerationPage = ({flaggedComments}: {flaggedComments:CommentFlag[]}) => {

  console.log(flaggedComments)
  return <>{
    flaggedComments.map(({comment, flag}) => (<div  className={cardStyles['card']} key={comment.id} >
        <RichTextDisplay value={comment.richText} />
   <div><span>Reason:</span> <span>{flag.reason}</span></div>
         <div><span>Details:</span> <span>{flag.details || '(none)'}</span></div>
      </div>
      ))}</>
}

