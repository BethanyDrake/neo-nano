import 'react-quill-new/dist/quill.snow.css'
import './richTextStyle.css'
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
})

const RichTextDisplay = ({ richText }: { richText: string }) => {
  return <ReactQuill modules={{ toolbar: null }} value={richText} readOnly bounds={'main'} />
}
export default RichTextDisplay
