import { useCallback } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

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
    (newValue: string, _delta: unknown, _source: unknown, editor: ReactQuill.UnprivilegedEditor) => {
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