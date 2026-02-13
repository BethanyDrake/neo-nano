require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const initProjects = async () => {
  await sql`drop table if exists projects`
  await sql`drop type if exists project_status`

  await sql`CREATE TYPE project_status AS ENUM ('planning', 'writing', 'editing', 'done')`

  await sql`create table projects (
  id bigint primary key GENERATED ALWAYS AS IDENTITY,
  user_id bigint REFERENCES users(id),
  title text,
  blurb text,
  excerpt text,
  word_count int,
  visibility visibility,
  status project_status
 )`
}

const doMigration = async () => {
  await initProjects()
}

doMigration().then(() => process.exit(0))
