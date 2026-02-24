'use client'
import { useForm } from "react-hook-form"

import formClasses from '@/lib/expandableForms/form.module.css'
import { BasicButton } from "@/lib/buttons/BasicButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { LeftRow, Row } from "@/lib/layoutElements/flexLayouts"
import { useState } from "react"
import { countWords } from "./countWords"
import { DotiContainer } from "@/lib/layoutElements/dotiContainer"
type Inputs = {
    text: string
}
export const WordCounter = () => {
      const { handleSubmit,register, reset } = useForm<Inputs>()
      const [analysis, setAnalysis] = useState<{wordCount: number}>()
      const _onSubmit = (data: Inputs) => {
        console.log("submiot")
        
        const wordCount = countWords(data.text)
        setAnalysis({wordCount})
      }


    return  (
        <>
    <form className={formClasses.form} onSubmit={handleSubmit(_onSubmit)}>
      <textarea style={{width: '100%', height: '10em'}} {...register('text')} /> 
      <Row justifyContent="right">
        <BasicButton buttonProps={{type: 'button', onClick:()=> { setAnalysis(undefined); reset()}}}
            >Clear</BasicButton>
        <BasicButton >Analyse <FontAwesomeIcon icon={faArrowRight} /></BasicButton></Row>
       </form>

       {analysis && 
       <div >
        <h2>Analysis:</h2>
        <LeftRow alignItems="baseline"><h3>Word Count:</h3> <p>{analysis.wordCount}</p></LeftRow>
       </div>
}
       </>
    )



}