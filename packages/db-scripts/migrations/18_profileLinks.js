require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const addLinks = async () => {
  await sql`drop table if exists profile_links`

  await sql`create table profile_links (
  user_id bigint REFERENCES users(id),
    wattpad text,
    ao3 text,
    substack text,
    bluesky text,
  PRIMARY KEY(user_id)
 );`

}

const doMigration = async () => {
  await addLinks()
}

doMigration().then(() => process.exit(0))
