import Image from 'next/image'
import { GutteredPage } from '../GutteredPage'
import { Centered } from '../layoutElements/flexLayouts'
import Link from 'next/link'
import styles from './code-of-conduct.module.css'

export const CodeOfConduct = () => {
  return (
    <GutteredPage>
      <Centered>
        <h1>Code of Conduct</h1>
      </Centered>

      <Centered>
        <Image
          width={200}
          height={200}
          alt="Falling papers marked with red cross, covered by a big green tick."
          src="https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/rules.png"
        />
      </Centered>

      <h2>Forum Guidelines</h2>
      <h3>1. Be Nice</h3>
      <p>
        {
          "We're here to support eachother, not tear eachother down. Don't harass people, don't swear at people, don't give brutal critique unless requested."
        }
      </p>

      <h3>2. Be Respectful</h3>
      <p>
        {
          'We all have different backgrounds and come from different cultures. Do not disparage groups of people based on race, religion, sexuality, gender, or physical ability. Hate speech will not be tolerated, even if it is not directed at a specific individual.'
        }
      </p>

      <h3>3. Be Respectable</h3>
      <p>
        {
          "Keep things 'safe for work' and appropriate for all ages. Mild profanity is allowed, but keep it light. Mild references to sex, drugs, and violence are okay, but keep it abstract and don't go into details. Do not encourage illegal or unsafe behaviour. No not say things that you wouldn't want a child to overhear and repeat, at full volume, in a crowded supermarket."
        }
      </p>

      <Centered style={{ marginTop: '4em' }}>
        <Image
        className={styles.image}
          width={150}
          height={150}
          alt="The hammer of jugdement landing on a rule-breaker."
          src="https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/enforcement.svg"
        />
      </Centered>
      <h2>Enforcement Strategy</h2>

      <h3>1. Permanence and Visibility </h3>
      <p>
        I made an intentional decision to not include any private messaging, editing of comments, or deletion of
        comments. This means that any inappropriate activity is visible to all, and not able to slide under the radar.
      </p>

      <h3>2. Report and Review</h3>
      <p>
        {
          "To report a comment, any user can click a flag and fill out a short form as to why the comment is inappropriate. The comment is immediately hidden. Next, people with the 'moderator' role are able to see a list of flagged comments, and either confirm or overrule the report. If confirmed, the comment will be permanently hidden. If it is overruled, the comment will be displayed as normal."
        }
      </p>
      <p>
        {
          'The comment and flag will continue to exist in the database in case further investigation is required. The comment can be flagged multiple times, and such comments will require additional review. The identity of the moderator who reviewed the flag is recorded.'
        }
      </p>
      <p>
        {
          "Repeated or serious violations of the code of conduct will result in account suspension at the admin's discretion."
        }
      </p>

      <h3>3. Open Source Code</h3>
      <p>
        {
          "This last one is more on the technical side. I've made all the code for the website "}<Link href={'https://github.com/BethanyDrake/neo-nano'}>publicly available</Link>{". This means that I, and any other contributors, are subject to public scrutiny. Any changes to the site are public knowledge, so no-one can sneak in malicious software or set up hidden features."
        }
      </p>

        <p className={styles.message}>
          All of the above is subject to change pending community feedback or emergent situations. If you have further
          concerns or ideas on how to ensure ongoing safety, please voice your suggestions in a <Link href={'/forum/meta/'}>meta thread</Link>, or
          contact <i>bethany@novel-november.com</i>
        </p>

    </GutteredPage>
  )
}
