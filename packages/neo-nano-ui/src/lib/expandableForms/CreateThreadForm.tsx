"use client"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useTopicContext } from "../context/TopicContext"
import { Column, Row } from "../layout"
import RichTextEditor from "../richText/RichTextEditor"
import { BasicButton } from "../buttons/BasicButton"
import { ExtendableIconButton } from "../buttons/ExtendableIconButton"
import { faAdd } from "@fortawesome/free-solid-svg-icons"
import formClasses from '@/lib/form.module.css'

type Inputs = {
  title: string
  commentText: string
}

const CreateThreadForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()
   const [richText, setRichText] = useState('')
    const [plainText, setPlainText] = useState('')
    const [errorText, setErrorText] = useState('')

    const { createThread, isLoading } = useTopicContext()

  const _onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    if (!plainText.trim()) {
      setErrorText("Can't post an empty comment.")
      return
    }
    const body = {
      ...data,
      commentRichText: richText,
      commentText: plainText
    }
    createThread(body).then(() => {
      reset()
      onSubmit()
      setRichText('')
      setPlainText('')
    })
  }

  return (
    <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
      <Column>
      <Row alignItems='center' justifyContent='left'>
        <label htmlFor="title">Title:</label>
        <input id="title" placeholder="Thread Title" {...register('title', {required: true})}/>
        </Row>

        {errors.title && <span className={formClasses.error}>^Please enter a title. This should be a short description of what you want to say.</span>}
        <label htmlFor="comment">Comment:</label>
        <RichTextEditor setValue={setRichText} value={richText} setPlainText={setPlainText} />
        {errorText && <span  className={formClasses.error}>^Please enter a comment to start the conversion.</span>}
        
        <BasicButton isLoading={isLoading} buttonProps={{type:"submit"}}>Post!</BasicButton>
      </Column>
    </form>
  )
}

export const CreateThreadExtendableForm = () => {

     const [isOpen, setIsOpen] = useState(false)

     return (
        <div>
     <ExtendableIconButton icon={faAdd} onClick={() => setIsOpen(true)}
         text="Create Thread" />
         {isOpen && <CreateThreadForm onSubmit={() => setIsOpen(false)}/>}
         </div>
     )
}