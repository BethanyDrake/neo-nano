import { useState } from 'react'
import { ExtendableIconButton, SmallIconButton } from '../buttons/ExtendableIconButton'
import { faAdd, faReply } from '@fortawesome/free-solid-svg-icons'
import { BasicButton } from '../buttons/BasicButton'
import RichTextEditor from '../richText/RichTextEditor'
import { Column } from '../layout'
import formClasses from '@/lib/form.module.css'
import styles from './expandableForm.module.css'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useThreadContext } from '../context/ThreadContext'
import { Comment, Profile } from '../forum.types'
import { truncateText } from '../misc'
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
    <div className={styles.container}>
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
      <ExtendableIconButton icon={faAdd} onClick={() => setIsOpen(true)} text="Add Comment" />
      {isOpen && <AddCommentForm afterSubmit={() => setIsOpen(false)} />}
    </div>
  )
}

export const ReplyToCommentForm = ({
  comment,
  author,
}: {
  comment: Pick<Comment, 'id' | 'text'>
  author: Pick<Profile, 'id' | 'displayName'>
}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div style={{ display: 'relative' }}>
      <SmallIconButton onClick={() => setIsOpen(!isOpen)} id={`reply-to-${comment.id}`} text={'Reply'} icon={faReply} />
      {isOpen && (
        <div
          style={{
            transform: 'translateY(2.5em)',
            zIndex: 500,
            position: 'absolute',
            left: '0',
            width: '100vw',
            backgroundColor: 'var(--background-colour-2)',
          }}
        >
          <AddCommentForm
            initialPlainText={`Replying to ${author.displayName}:\n${truncateText(comment.text)}\n↩️`}
            initialRichText={`<p><em>Replying to ${author.displayName}:</em></p><blockquote>${truncateText(comment.text)}</blockquote><p>↩️</p>`}
            afterSubmit={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
