import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { Centered } from '@/lib/layoutElements/flexLayouts'
import { Metadata } from 'next'
import classNames from '@/lib/styles/faq.module.css'
export const metadata: Metadata = {
  title: 'FAQ',
  description: "Frequently asked questions"
}

type Question = {
 q: string,
 a: string
}
const questions: Question[] = [
    {
        q: "Where do I write my novel?",
        a: "Use your normal text editor, for example google docs or microsoft word."
    },{
        q: "Where do I submit my novel?",
        a: "Nowhere! The first draft of your novel is for yourself: no-one needs to see it for it to count."

    },
    {
        q: "Can I use AI?",
        a: "No. This is a writing challenge, not a text generation challenge."
    }, {
        q: "Can I write by hand?",
        a: "Yes! If you’re writing by hand, estimate your word count by counting the number of words in a line multiplied by the number of lines in a page."
    },

    {
        q: "I wrote a novel! What now?",
        a: "Congratulations! Let it rest over December, and join us in January for the 80 Hour Edit."
    },
    {
        q: "November doesn't work for me! Can I write at a different time?",
        a: "Of course! Join us in July for a mini challenge, The Mid-Year Novelette. Or, make a custom goal at any time. The forum might be a little quiet though. "
    },

    {
        q: "Do I have to start from scratch?",
        a: "The challenge is to write a new, complete novel, not finish a novel that you've already started. Brainstorming and planning ahead of time is allowed and encouraged though!"
    },


]
const AboutPage = () => {
  return (
    <>
    <GutteredPage>
      <Centered>
        <h1>FAQ</h1>
      </Centered>
      <ul className={classNames.QA}>
        {questions.map(({q, a}) => (
            <li key={q}>
            <h2 className={classNames.Q}>{q}</h2>
            <div>{a}</div>
            </li>
        )) }
     </ul>
    </GutteredPage>
    </>
  )
}

const Page = () => {
  return <AboutPage />
}

export default Page
