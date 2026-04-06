import { useState } from "react";
import { TextButton } from "../buttons/BasicButton";
import { ClientSideOnly } from "../ClientSideOnly";
import { Row } from "../layoutElements/flexLayouts";
import { CommentSnapshot } from "../types/forum.types";
import classNames from './CommentCard.module.css'
import RichTextDisplay from "../richText/RichTextDisplay";

export const CommentSnapshotView = ({snapshot}: {snapshot: Pick<CommentSnapshot, 'version' | 'richText' | 'postedAt'>}) => {
    const {postedAt, version, richText} = snapshot

    const buttonText = version === 0 ? "(view original)" : `(view v${version})`

    const [isOpen, setIsOpen] = useState(false)

    return ( <><Row gap='5px' justifyContent="right"><TextButton buttonProps={{onClick: () => setIsOpen(!isOpen)}}>{buttonText}</TextButton>
    <time style={{height:'1em' }} className={classNames.datetime}>
              <ClientSideOnly>{postedAt.toLocaleString()}</ClientSideOnly>
          </time></Row>
          
          {isOpen && <RichTextDisplay richText={richText}/>}
          </>)

}