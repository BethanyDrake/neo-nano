import { CodeOfConduct } from "@/lib/moderation/CodeOfConduct"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Code of Conduct',
  description: 'Guidelines for appropriate behaviour.'
}

const Page = () => {
    return <CodeOfConduct />
}

export default Page