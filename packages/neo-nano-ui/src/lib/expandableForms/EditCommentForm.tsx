import { useState } from 'react'
import { BasicButton } from '../buttons/BasicButton'
import RichTextEditor from '../richText/RichTextEditor'
import { Column } from '../layoutElements/flexLayouts'
import formClasses from '@/lib/expandableForms/form.module.css'
import styles from './expandableForm.module.css'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { updateComment } from '../serverFunctions/forum/addThreadComment'
import { useCommentActionContext, useCommentCardContext } from '../commentCards/CommentCard'
import { useThreadContext } from '../context/ThreadContext'
type Inputs = {
  commentText: string
}

export const EditCommentForm = () => {
  const {comment} = useCommentCardContext()

  const initialRichText = comment.richText
  const initialPlainText = comment.text
  const {cancelAction} = useCommentActionContext()
  const {updateCommentsData} = useThreadContext()
  const { handleSubmit } = 
  useForm<Inputs>()
 
  const [richText, setRichText] = useState(initialRichText ?? '')
  const [plainText, setPlainText] = useState(initialPlainText ?? '')
    const [errorText, setErrorText] = useState('')
   const { mutate, status } = useMutation<unknown, Error, {plainText: string, richText: string}>({
      mutationFn: (variables) => {
        console.log("plainText mute", variables.plainText)
    return updateComment(
    comment.id,
    variables.plainText,
    variables.richText
   )}, 
   mutationKey: ['editComment', comment.id],
    onSuccess: () => {
      cancelAction()
      updateCommentsData()
    },
    onError: () => setErrorText("Network error :(")
  })


  const _onSubmit: SubmitHandler<Inputs> = async () => {
    if (status === 'pending') return
    if (!plainText.trim()) {
      setErrorText("Can't post an empty comment.")
      return
    }
    if (plainText === initialPlainText && richText === initialRichText) {
      setErrorText("No changes.")
      return 
    }
 
    mutate({plainText, richText})
  }

  return (
    <div ref={(node) => node?.scrollIntoView?.({behavior: "smooth"})} className={styles.container}>
      <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
        <Column>
          {errorText && <span>{errorText}</span>}
          <div className={styles.richTextEditor}>
            <RichTextEditor setValue={setRichText} value={richText} setPlainText={setPlainText} />
          </div>
          <BasicButton isLoading={status === 'pending'} buttonProps={{ type: 'submit' }}>
            Edit
          </BasicButton>
        </Column>
      </form>
    </div>
  )
}

