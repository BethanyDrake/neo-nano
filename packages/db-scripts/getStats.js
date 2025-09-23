require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}`})
const { neon } = require('@neondatabase/serverless')
require('./validate-environment')

const sql = neon(process.env.DATABASE_URL)

const countRows = async () => {
  const categories = (await sql`select count(*) from categories`)[0].count
  const users = (await sql`select count(*) from users`)[0].count
  const topics = (await sql`select count(*) from topics`)[0].count
  const threads = (await sql`select count(*) from threads`)[0].count
  const flags = (await sql`select count(*) from flags`)[0].count
  console.log({ categories, users, topics, threads, flags })
}

const getStats = async () => {
  await countRows()
}

getStats().then(() => process.exit(0))
