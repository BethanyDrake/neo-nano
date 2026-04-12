import { getThreadReactions } from './getThreadReactions'
import { clearDb } from '@/tests/utils/clearDb'
import { addCategory, addComment, addLike, addThread, addTopic, addUser } from '@/tests/utils/fillDb'

describe('getThreadReactions', () => {
  beforeEach(async () => {
    await clearDb()
  })

  test('gets likes for each comment in the thread', async () => {
    const user1 = await addUser()
    const user2 = await addUser({ displayName: 'Someone Else' })

    await addCategory()
    await addTopic()
    const threadId = await addThread({ author: user1 })
    const comment1 = await addComment(threadId, { author: user1 })
    const comment2 = await addComment(threadId, { author: user1 })
    await addLike(comment1, user1)
    await addLike(comment1, user2)

    await addLike(comment2, user1)

    expect((await getThreadReactions(threadId))[comment1]).toEqual({
      like: [user1, user2],
    })

    expect((await getThreadReactions(threadId))[comment2]).toEqual({
      like: [user1],
    })
  })
})
