import { clearDb } from '@/tests/utils/clearDb'
import { getThreads } from './getThreads'
import { addCategory, addComment, addThread, addTopic, addUser, GENERAL_TOPIC } from '@/tests/utils/fillDb'

describe('getThreads', () => {
  beforeEach(async () => {
    await clearDb()
  })

  test('no threads', async () => {
    addCategory()
    addTopic()
    const result = await getThreads(GENERAL_TOPIC)
    expect(result.threadSummaries).toEqual([])
    expect(result.totalThreads).toEqual('0')
  })

  it('gets threads with the initial comment', async () => {
    const user1 = await addUser({}, 'external-id')
    const user2 = await addUser({ displayName: 'Someone Else' })
    await addCategory()
    await addTopic()
    const threadId = await addThread({ author: user1 })
    await addComment(threadId, { author: user1, text: 'Comment 1 text.' })
    await addComment(threadId, { author: user2, text: 'Comment 2 text.' })
    const result = await getThreads(GENERAL_TOPIC)
    expect(result.threadSummaries).toHaveLength(1)
    expect(result.totalThreads).toEqual('1')
    expect(result.threadSummaries[0].text).toEqual('Comment 1 text.')
    expect(result.threadSummaries[0].totalComments).toEqual(2)
  })
})
