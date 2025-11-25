import Image from 'next/image'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { Centered, Column, LeftRow } from '@/lib/layoutElements/flexLayouts'
import Link from 'next/link'
import { PropsWithChildren, ReactNode } from 'react'

const Role = ({ children }: PropsWithChildren) => {
  return <div style={{ fontStyle: 'italic' }}>{children}</div>
}

const Name = ({ children }: PropsWithChildren) => {
  return <h3 style={{ paddingBottom: 0 }}>{children}</h3>
}

const TeamMember = ({
  fullName,
  role,
  description,
  picture,
}: {
  fullName: string
  role: string
  description: ReactNode
  picture: string
}) => {
  return (
    <LeftRow style={{ flexWrap: 'wrap' }}>
      <Image
        style={{ border: '2px solid var(—primary-dark)', borderRadius: '8px' }}
        src={picture}
        alt={fullName}
        width={150}
        height={150}
      />

      <div style={{ minWidth: '250px', maxWidth: '600px' }}>
        {' '}
        <Name>{fullName}</Name>
        <Role>{role}</Role>
        <p>{description}</p>
      </div>
    </LeftRow>
  )
}

const TechnologyItem = ({
  fullName,
  role,
  description,
  picture,
}: {
  fullName: string
  role: string
  description: ReactNode
  picture: string
}) => {
  return (
    <LeftRow style={{ flexWrap: 'wrap' }}>
      <Image className="darkmode-invert" src={picture} alt={fullName} width={100} height={100} />

      <div style={{ minWidth: '250px', maxWidth: '650px' }}>
        <Name>{fullName}</Name>
        <Role>{role}</Role>
        <p>{description}</p>
      </div>
    </LeftRow>
  )
}

const AboutPage = () => {
  return (
    <GutteredPage>
      <Centered>
        <h1>About</h1>
      </Centered>

      <h2>Team</h2>
      <Column>
        <TeamMember
          fullName={'Bethany Drake'}
          role={'Lead Developer'}
          description={
            'Bethany is an Australian programmer specialising in web development. She primarily writes fantasy novels, with occasional daliances into sci-fi and historical fiction.'
          }
          picture={'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/about/bethany-fishpond-500.jpg'}
        />
        <TeamMember
          fullName={'You?'}
          role={'Graphic designer'}
          description={
            <>
              Although she does her best, Bethany is not an artist, graphic designer, or ui designer. If you see
              something ugly that you know how to fix, please contact <i>bethany@novel-november.com</i> with a short
              description of your experience and availability.
            </>
          }
          picture={'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/about/unknown.svg'}
        />

        <TeamMember
          fullName={'Rahma • You?'}
          role={'Testers'}
          description={
            <>
              {
                "Before changes are released to the site, they are deployed to a 'preview' environment. This preview site can be used like a sandbox to play around with the new feature and find any bugs. For instructions on how to get access to the preview site, please contact "
              }{' '}
              <i>bethany@novel-november.com</i>
            </>
          }
          picture={'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/about/unknown.svg'}
        />
      </Column>

      <h2 style={{marginTop: '16px'}}>Technology</h2>
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
            Relational databases store information in a way that is optimised for retrieval and manipulation. It makes
            it easy to reach in and grab the exact information that we need — like, getting all the comments for a
            particular thread. <Link href="https://neon.com/">Neon</Link> is a service for managing database
            infrastructure, while <Link href="https://www.postgresql.org/">PostgreSQL</Link> is the underlying
            technology.
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

   
    </GutteredPage>
  )
}

const Page = () => {
  return <AboutPage />
}

export default Page
