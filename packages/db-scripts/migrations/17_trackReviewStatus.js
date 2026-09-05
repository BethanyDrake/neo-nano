require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const addReviewStatus = async () => {
  await sql`CREATE TYPE review_status AS ENUM ('pending_review', 'confirmed_inappropriate')`; 
  await sql`alter table comments
  add column review_status review_status default NULL`
}

const doMigration = async () => {
  await addReviewStatus()
}

doMigration().then(() => process.exit(0))
