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
