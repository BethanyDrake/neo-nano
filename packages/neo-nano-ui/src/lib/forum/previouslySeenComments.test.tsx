import { renderHook, waitFor } from '@testing-library/react'
import {
  setPreviouslySeenThreadComments,
  setPreviouslySeenTopicThreads,
  usePreviouslySeenThreadComments,
  usePreviouslySeenTopicThreads,
} from './previouslySeenComments'

const createLocalStorageMock = () => {
  const store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
  }
}

describe('previouslySeenComments', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: createLocalStorageMock(),
      writable: true,
    })
  })

  describe('previouslySeenThreadComments', () => {
    test('initial state', async () => {
      const { result } = renderHook(() => usePreviouslySeenThreadComments('thread-1'))
      await waitFor(() => {
        expect(result.current).toEqual(0)
      })
    })
    test('seen some before', async () => {
      setPreviouslySeenThreadComments('thread-1', 7)
      const { result } = renderHook(() => usePreviouslySeenThreadComments('thread-1'))
      await waitFor(() => {
        expect(result.current).toEqual(7)
      })
    })
  })

  describe('previouslySeenTopicThreads', () => {
    test('initial state', async () => {
      const { result } = renderHook(() => usePreviouslySeenTopicThreads('topic-1'))
      await waitFor(() => {
        expect(result.current).toEqual({threads: 0, comments: 0})
      })
    })
    test('seen some before', async () => {
      setPreviouslySeenTopicThreads('topic-1', 7, 40)
      const { result } = renderHook(() => usePreviouslySeenTopicThreads('topic-1'))
      await waitFor(() => {
        expect(result.current).toEqual({threads: 7, comments: 40})
      })
    })
  })
})
