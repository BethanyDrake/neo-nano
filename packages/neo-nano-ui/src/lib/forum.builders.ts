import { Comment, Goal, Profile } from './forum.types'
import { ThreadSummary } from './serverFunctions/forum/getThreads'

export const buildComment = (comment: Partial<Comment> = {}) => ({
  id: '',
  text: '',
  richText: '',
  author: '',
  createdAt: Date(),
  ...comment,
})

export const buildThreadSummary = (threadSummary: Partial<ThreadSummary> = {}) => ({
  id: '',
  title: '',
  author: '',
  totalComments: 0,
  text: '',
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
  ...goal
})
