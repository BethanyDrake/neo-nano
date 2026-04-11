require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const addIsDeleted = async () => {

  await sql`alter table comments
  add column is_deleted boolean default false`
}

const doMigration = async () => {
  await addIsDeleted()
}

doMigration().then(() => process.exit(0))
