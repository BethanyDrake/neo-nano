import dynamic from 'next/dynamic'
import { useCallback } from 'react'
import 'react-quill-new/dist/quill.snow.css'
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
})

const formats = ['header', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'link']

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'link'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}

const RichTextEditor = ({
  value,
  setValue,
  setPlainText,
}: {
  value: string
  setValue: (s: string) => void
  setPlainText: (s: string) => void
}) => {
  const onChange = useCallback(
    (newValue: string, _delta: unknown, _source: unknown, editor: {getText: () => string}) => {
      setValue(newValue)
      setPlainText(editor.getText())
    },
    [setPlainText, setValue],
  )

  return (
    <ReactQuill
      theme="snow"
      onChange={onChange}
      value={value}
      modules={modules}
      formats={formats}
      placeholder="Your comment here..."
      bounds={'main'}
    />
  )
}

export default RichTextEditor