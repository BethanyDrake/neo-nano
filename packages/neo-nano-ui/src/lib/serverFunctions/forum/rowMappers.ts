import { Comment, Flag } from "@/lib/types/forum.types";
import { parseISO } from "date-fns";

// @ts-expect-error db mapper
export const mapSnapshot = ({ id, snapshot_of, comment_text, rich_text, version, posted_at }): CommentSnapshot => ({
  id,
  snapshotOf: snapshot_of,
  text: comment_text,
  richText: rich_text,
  postedAt: parseISO(posted_at),
  version
})

export type RawFlag = {
  review_outcome: Flag['reviewOutcome'],
  id: string,
  reported_by: string,
  created_at: Date,
  details: string,
  reviewed_by: string | null,
  reason: Flag['reason'],
  comment: string
} 

export const mapFlag = ({ id, comment, reported_by, created_at, reason, details, reviewed_by, review_outcome }: RawFlag): Flag => ({
  id,
  comment,
  reportedBy: reported_by,
  createdAt: created_at,
  reason,
  details,
  reviewedBy: reviewed_by,
  reviewOutcome: review_outcome,
})

export type RawComment = {
  id: string,
  comment_text: string,
  rich_text: string,
  author: string,
  thread: string,
  created_at: Date,
  is_deleted: boolean,
  review_status: null | 'pending_review' | 'confirmed_inappropriate'
}

export const mapComment = (rawComment: RawComment): Comment  => {
  return {
  id: rawComment.id,
  text: rawComment.comment_text,
  richText: rawComment.rich_text,
  author: rawComment.author,
  createdAt: rawComment.created_at,
  isDeleted: rawComment.is_deleted,
  reviewStatus: rawComment.review_status
}
}