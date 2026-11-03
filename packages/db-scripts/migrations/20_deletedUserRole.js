require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const addDeletedUserRole = async () => {
  await sql`ALTER TYPE role ADD VALUE IF NOT EXISTS 'deleted';`
}

const doMigration = async () => {
  await addDeletedUserRole()
}

doMigration().then(() => process.exit(0))
