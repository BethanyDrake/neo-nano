import ReactQuill from "react-quill-new"
import 'react-quill-new/dist/quill.snow.css'

const RichTextDisplay = ({ value }: { value: string }) => {
  return <ReactQuill modules={{ toolbar: null }} value={value} readOnly bounds={'main'} />
}
export default RichTextDisplay
