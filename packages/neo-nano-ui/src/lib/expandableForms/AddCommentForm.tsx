import { useState } from 'react'
import { FloatingActionButton } from '../buttons/ExtendableIconButton'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { BasicButton } from '../buttons/BasicButton'
import RichTextEditor from '../richText/RichTextEditor'
import { Column } from '../layoutElements/flexLayouts'
import formClasses from '@/lib/expandableForms/form.module.css'
import styles from './expandableForm.module.css'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useThreadContext } from '../context/ThreadContext'
import { truncateText } from '../misc'
import { useCommentActionContext, useCommentCardContext } from '../commentCards/CommentCard'
type Inputs = {
  commentText: string
}
const AddCommentForm = ({
  afterSubmit,
  initialPlainText,
  initialRichText,
}: {
  afterSubmit: () => void
  initialPlainText?: string
  initialRichText?: string
}) => {
  const { handleSubmit, reset } = useForm<Inputs>()
  const { isLoading, postComment } = useThreadContext()

  const [richText, setRichText] = useState(initialRichText ?? '')
  const [plainText, setPlainText] = useState(initialPlainText ?? '')
  const [errorText, setErrorText] = useState('')
  const _onSubmit: SubmitHandler<Inputs> = async () => {
    if (isLoading) return
    if (plainText.trim()) {
      await postComment(plainText, richText)
      reset()
      setRichText('')
      setPlainText('')
      afterSubmit()
    } else {
      setErrorText("Can't post an empty comment.")
    }
  }

  return (
    <div ref={(node) => node?.scrollIntoView?.({behavior: "smooth", block:"end"})}>
      <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
        <Column>
          {errorText && <span>{errorText}</span>}
          <div className={styles.richTextEditor}>
            <RichTextEditor setValue={setRichText} value={richText} setPlainText={setPlainText} />
          </div>
          <BasicButton isLoading={isLoading} buttonProps={{ type: 'submit' }}>
            Post!
          </BasicButton>
        </Column>
      </form>
    </div>
  )
}

export const ExpandableAddCommentForm = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <FloatingActionButton onClick={() => setIsOpen(true)} text={'Add Comment'} icon={faAdd} visible={!isOpen}/>
      {isOpen && <AddCommentForm afterSubmit={() => setIsOpen(false)} />}
    </div>
  )
}

export const ReplyToCommentForm = () => {
  const {comment, author} = useCommentCardContext()
  const {cancelAction} = useCommentActionContext()

  return (
    <AddCommentForm
      initialPlainText={`Replying to ${author.displayName}:\n${truncateText(comment.text)}\n↩️`}
      initialRichText={`<p><em>Replying to ${author.displayName}:</em></p><blockquote>${truncateText(comment.text)}</blockquote><p>↩️</p>`}
      afterSubmit={cancelAction}
    />
  )
}
