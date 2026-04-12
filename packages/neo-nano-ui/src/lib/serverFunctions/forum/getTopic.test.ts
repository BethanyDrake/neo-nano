import { clearDb } from '@/tests/utils/clearDb'
import { addCategory, addTopic } from '@/tests/utils/fillDb'
import { getTopic } from './getTopic'

describe('getTopic', () => {
  beforeEach(async () => {
    await clearDb()
  })

  test('gets the topic by id', async () => {
    await addCategory({ id: 'category-id', title: 'Category Title' })
    await addTopic({
      id: 'topic-id',
      category: 'category-id',
      description: 'Topic description.',
      title: 'Topic Title',
      icon: 'faShield',
    })
    const result = await getTopic('topic-id')
    expect(result.category).toEqual({ id: 'category-id', title: 'Category Title' })
    expect(result.topic).toEqual({
      category: 'category-id',
      description: 'Topic description.',
      icon: 'faShield',
      id: 'topic-id',
      title: 'Topic Title',
    })
  })
})
