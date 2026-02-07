require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const initSprintRecords = async () => {
  await sql`drop table if exists user_sprints`
  await sql`drop table if exists sprints`
  await sql`drop type if exists participation_state`


  await sql`create table sprints (
 id bigint primary key GENERATED ALWAYS AS IDENTITY,
 start_time timestamp,
 duration_seconds int,
 visibility visibility
 )`


 await sql`CREATE TYPE participation_state AS ENUM ('registered', 'completed')`

  await sql`create table user_sprints(
    user_id bigint REFERENCES users(id),
    sprint_id bigint REFERENCES sprints(id),
    participation_state participation_state,
    word_count int,
    PRIMARY KEY(user_id, sprint_id)
)
 `
}

const doMigration = async () => {
  await initSprintRecords()
}

doMigration().then(() => process.exit(0))
