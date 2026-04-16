import { Comment, CommentSnapshot, Goal, Profile, Thread } from './forum.types'
import { ThreadSummary } from '@/lib/serverFunctions/forum/getThreads'

export const buildCommentSnapshot = (snapshot: Partial<CommentSnapshot> = {}): CommentSnapshot => ({
  id: '',
  text: '',
  richText: '',
  postedAt: new Date(),
  version: 0,
  snapshotOf: '',
  ...snapshot

})


export const buildComment = (comment: Partial<Comment> = {}) => ({
  id: '',
  text: '',
  richText: '',
  author: '',
  createdAt: new Date(),
  isDeleted: false,
  ...comment,
})

export const buildThread = (thread: Partial<Thread> = {}): Thread => ({
  id: '',
  title: '',
  author: '',
  topic: '',
  ...thread
})

export const buildThreadSummary = (threadSummary: Partial<ThreadSummary> = {}): ThreadSummary => ({
  id: '',
  title: '',
  author: '',
  totalComments: 0,
  text: '',
  topic: '',
  authorDisplayName: '',
  isDeleted: false,
  ...threadSummary,
})

export const buildProfile = (profile: Partial<Profile> = {}): Profile => ({
  id: '',
  displayName: '',
  aboutMe: undefined,
  role: 'user',
  ...profile,
})

export const buildGoal = (goal: Partial<Goal> = {}): Goal => ({
  id: '',
  title: '',
  startDate: '',
  lengthDays: 0,
  records: [],
  userId: '',
  target: 0,
  visibility: 'private',
  metric: 'words',
  ...goal
})
