import ReactQuill from "react-quill-new"
import 'react-quill-new/dist/quill.snow.css'
import './richTextStyle.css'
console.log("RichTextDisplay")

const RichTextDisplay = ({ richText }: { richText: string }) => {
  return <ReactQuill modules={{ toolbar: null }} value={richText} readOnly bounds={'main'} />
}
export default RichTextDisplay
