require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon } = require('@neondatabase/serverless')
const sql = neon(process.env.DATABASE_URL)

require('./validate-environment')

const clearDb = async () => {
  await sql`delete from comment_reactions`
  await sql`delete from flags`
  await sql`delete from comment_snapshots`
  await sql`delete from comments`
  await sql`delete from goals`
  await sql`delete from threads`
  await sql`delete from user_awards`
  await sql`delete from projects`
  await sql`delete from user_sprints`
  await sql`delete from users`
}

clearDb().then(() => process.exit(0))
