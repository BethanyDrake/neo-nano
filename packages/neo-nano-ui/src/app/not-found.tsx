import { Column } from "@/lib/layoutElements/flexLayouts"
import Image from "next/image"

function NotFoundPage() {

	return (
		<Column alignItems="center" style={{margin: '2em auto'}}>
	<Image width={450} height={175} src="https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/not-found.svg" alt={"Broken pencil, representing sadness."}/>
<h1>Page Not Found</h1><p>This page does not exist. Care to try another?</p></Column>)
}

export default NotFoundPage