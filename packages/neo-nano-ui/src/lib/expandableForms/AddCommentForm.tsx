import { useState } from 'react'
import { ExtendableIconButton } from '../buttons/ExtendableIconButton'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { BasicButton } from '../buttons/BasicButton'
import RichTextEditor from '../richText/RichTextEditor'
import { Column } from '../layout'
import formClasses from '@/lib/form.module.css'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useThreadContext } from '../context/ThreadContext'
type Inputs = {
  commentText: string
}
const AddCommentForm = ({ afterSubmit }: { afterSubmit: () => void }) => {
  const { handleSubmit, reset } = useForm<Inputs>()
  const { isLoading, postComment } = useThreadContext()

  const [richText, setRichText] = useState('')
  const [plainText, setPlainText] = useState('')
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
    <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
        {errorText && <span>{errorText}</span>}
        <RichTextEditor setValue={setRichText} value={richText} setPlainText={setPlainText} />

        <BasicButton isLoading={isLoading} buttonProps={{ type: 'submit' }}>
          Post!
        </BasicButton>
      </Column>
    </form>
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
