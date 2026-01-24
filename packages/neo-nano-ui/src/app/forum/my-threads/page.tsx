import { ThreadCard } from '@/lib/ThreadCard'
import { Centered, Column } from '@/lib/layoutElements/flexLayouts'
import { Breadcrumbs } from '@/lib/Breadcrumbs'
import { getMyThreads } from '@/lib/serverFunctions/forum/getMyThreads'
import { BasicButton } from '@/lib/buttons/BasicButton'
import Link from 'next/link'
import { FullWidthPage } from '@/lib/layoutElements/FullWidthPage'

export default async function Page() {
  const myThreads = await getMyThreads()
  const breadcrumbItems = [{ href: '/forum', text: 'Forum' }, { text: 'My Threads' }]

  return (
    <FullWidthPage>
      <Column>
        {' '}
        <Breadcrumbs breadcrumbItems={breadcrumbItems} />
        {myThreads.length === 0 && (
          <>
            <p style={{ textAlign: 'center' }}>
              {"(There's nothing here because you haven't started any threads so far)."}
            </p>
            <Link href="/forum/introductions">
              <Centered>
                <BasicButton>Introduce Myself</BasicButton>
              </Centered>
            </Link>
          </>
        )}
        {myThreads.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} topicId={thread.topic} />
        ))}
      </Column>
    </FullWidthPage>
  )
}
