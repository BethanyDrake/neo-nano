import { ChangeEvent, useCallback } from "react"

type Props = {
     value:string,
  setValue: (s: string) => void,
  setPlainText: (s:string) => void,
    }

const RichTextEditor = ({value, setValue,setPlainText}: Props) => {
    const _onChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value
        setPlainText(newValue)
        setValue(`<p>${newValue}</p>`)
    }, [setPlainText, setValue])
    return <textarea value={value} onChange={_onChange} data-testid="mock-rich-text-editor"/>
}
export default RichTextEditor