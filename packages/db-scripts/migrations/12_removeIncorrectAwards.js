require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

/*
Time-based trophies were incorrectly awarded to word-count based goals.
*/

const deleteAwards = async () => {
  await sql`delete from user_awards where award >= 8`
}

const doMigration = async () => {
  await deleteAwards()
}

doMigration().then(() => process.exit(0))
