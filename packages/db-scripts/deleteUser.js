require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon } = require('@neondatabase/serverless')
const sql = neon(process.env.DATABASE_URL)
const { randomUUID } = require('node:crypto')

require('./validate-environment')

const createSnapshot = async (comment) =>
  sql`INSERT INTO comment_snapshots (snapshot_of, version, comment_text, rich_text, posted_at)
      VALUES (${comment.id}, ${comment.version}, ${comment.comment_text}, ${comment.rich_text}, ${comment.updated_at}
)`

const deleteComment = async (commentId, newVersion) => {
  await sql`UPDATE comments
    SET updated_at=Now(),
    version=${newVersion},
    comment_text='',
    rich_text='',
    is_deleted=${true}
    where comments.id = ${commentId}
    returning comments.*
    `
}

const deleteUser = async () => {
  const userId = process.argv[2]
  console.log('DELETING USER:', userId )

  await sql`delete from user_sprints where user_sprints.user_id=${userId}`
  await sql`delete from projects where projects.user_id=${userId}`
  await sql`delete from goals where goals.user_id=${userId}`
  await sql`delete from user_awards where user_awards.awarded_to=${userId}`
  await sql`delete from profile_links where profile_links.user_id=${userId}`

  // rename them to 'deleted user'
  await sql`update users set display_name='DELETED USER', about_me=NULL,  role='deleted', external_id=${randomUUID()}
    where id=${userId}
    `
  // create a snapshot and delete each of their comments
  const comments = await sql`select * from comments where comments.author=${userId}`
  await Promise.all(
    comments.map(async (comment) => {
      await createSnapshot(comment)
      await deleteComment(comment.id, comment.version + 1)
    }),
  )
}

deleteUser().then(() => process.exit(0))
