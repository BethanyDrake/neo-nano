import Link from 'next/link'
import { Column } from '../layoutElements/flexLayouts'
import { TechnologyItem } from './SectionItems'

export const TechnologyItems = () => (
  <Column>
    <TechnologyItem
      fullName={'Next.js'}
      role={'Framework'}
      description={
        <>
          <Link href="https://nextjs.org/">Next.js</Link> is ostensibly a frontend framework, although server-side
          rendering, server components, and server actions mean it also acts as a BFF API. It uses{' '}
          <Link href="https://react.dev/">React</Link> and{' '}
          <Link href="https://www.typescriptlang.org/">Typescript.</Link>
        </>
      }
      picture={'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/about/nextjs-icon.svg'}
    />
    <TechnologyItem
      fullName={'Neon (PostgreSQL)'}
      role={'Relational Database'}
      description={
        <>
          Relational databases store information in a way that is optimised for retrieval and manipulation. It makes it
          easy to reach in and grab the exact information that we need — like, getting all the comments for a particular
          thread. <Link href="https://neon.com/">Neon</Link> is a service for managing database infrastructure, while{' '}
          <Link href="https://www.postgresql.org/">PostgreSQL</Link> is the underlying technology.
        </>
      }
      picture={'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/about/neon.svg'}
    />

    <TechnologyItem
      fullName={'Auth0'}
      role={'Authentication'}
      description={
        <>
          <Link href="https://auth0.com/features/universal-login">Auth0</Link> implements{' '}
          <Link href="https://oauth.net/2/">OAuth</Link>, which is an industry-standard protocol for authorisation. It
          handles everything related to signup/login.
        </>
      }
      picture={'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/about/auth0-icon.svg'}
    />

    <TechnologyItem
      fullName={'GitHub'}
      role={'Source control'}
      description={
        <>
          <Link href="https://git-scm.com/">Git</Link>
          {
            " is a tool that makes it easy for lots of people to safely work on a project at once. It keeps a record of all the code that has been written, like using 'track changes' on a shared document. This means that if something breaks, it's easy to go back to a previous version. Anyone can make a github account and"
          }{' '}
          <Link href="https://github.com/BethanyDrake/neo-nano">contribute to the project.</Link>{' '}
          {"Don't worry, it will be checked before it goes live — you won't break anything!"}
        </>
      }
      picture={'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/about/github-logo.png'}
    />
  </Column>
)
