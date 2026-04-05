require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const addUpdatedAtColumn = async () => {

  await sql`alter table comments
  add column updated_at TIMESTAMPTZ`

  await sql`alter table comments
  add column version int default 0`

    await sql`UPDATE comments
  set updated_at = comments.created_at
  `

   await sql`CREATE TABLE comment_snapshots (
    id bigint primary key GENERATED ALWAYS AS IDENTITY,
    snapshot_of bigint REFERENCES comments(id),
    comment_text text,
    rich_text text,
    version int,
    posted_at TIMESTAMPTZ
);
   `

}

const doMigration = async () => {
  await addUpdatedAtColumn()
}

doMigration().then(() => process.exit(0))
