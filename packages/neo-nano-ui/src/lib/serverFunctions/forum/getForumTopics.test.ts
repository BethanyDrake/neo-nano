import { addCategory, addComment, addThread, addTopic, GENERAL_CATEGORY } from '@/tests/utils/fillDb'
import { getForumTopics } from './getForumTopics'
import { clearDb } from '@/tests/utils/clearDb'

describe('getForumTopics', () => {
  beforeEach(async () => {
    await clearDb()
  })
  test('topic with no threads', async () => {
    await addCategory()
    await addTopic()
    const result = await getForumTopics()
    expect(result[0].topics[0].total_comments).toEqual(0)
    expect(result[0].topics[0].total_threads).toEqual(0)
  })

  test('topic threads and comments', async () => {
    await addCategory()
    await addTopic()
    const thread1 = await addThread()
    const thread2 = await addThread()
    await addComment(thread1)
    await addComment(thread2)
    await addComment(thread2)
    const result = await getForumTopics()
    expect(result[0].topics[0].total_comments).toEqual(3)
    expect(result[0].topics[0].total_threads).toEqual(2)
  })

  test('category with multiple topics', async () => {
    await addCategory()
    await addTopic({ id: 'topic-1', category: GENERAL_CATEGORY })
    await addTopic({ id: 'topic-2', category: GENERAL_CATEGORY })
    const result = await getForumTopics()
    expect(result[0].topics).toHaveLength(2)
  })

  test('category with single topic', async () => {
    await addCategory({ id: GENERAL_CATEGORY, title: 'Category Title' })
    await addTopic({
      id: 'topic-1',
      category: GENERAL_CATEGORY,
      icon: 'faBoltLightning',
      title: 'Topic Title',
      description: 'Topic description.',
    })
    const result = await getForumTopics()
    expect(result).toHaveLength(1)
    expect(result[0].title).toEqual('Category Title')
    expect(result[0].topics).toHaveLength(1)
    expect(result[0].topics[0]).toEqual(
      expect.objectContaining({
        category: 'general-category',
        description: 'Topic description.',
        icon: 'faBoltLightning',
        id: 'topic-1',
        title: 'Topic Title',
      }),
    )
  })
})
