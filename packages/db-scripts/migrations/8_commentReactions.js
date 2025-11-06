require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const initCommentReactions = async () => {
  await sql`drop table if exists comment_reactions`
  await sql`drop type if exists reaction_type`
  await sql`CREATE TYPE reaction_type AS ENUM ('like')`

  await sql`create table comment_reactions (
  user_id bigint REFERENCES users(id),
    comment_id bigint REFERENCES comments(id),
    reacted_at TIMESTAMPTZ DEFAULT Now(),
    reaction reaction_type,
    PRIMARY KEY(user_id, comment_id)
 )`

  const commentReactions = await sql`select * from comment_reactions`
  console.log(commentReactions)
}

const doMigration = async () => {
  await initCommentReactions()
}

doMigration().then(() => process.exit(0))
