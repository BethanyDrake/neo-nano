
require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)



const doMigration = async () => {

  await sql`drop type if exists progress_unit`
  await sql`CREATE TYPE progress_unit AS ENUM ('words', 'minutes')`

  await sql`ALTER TABLE goals DROP COLUMN IF EXISTS metric`;
  await sql`ALTER TABLE goals ADD COLUMN metric progress_unit DEFAULT 'words'`;
}

doMigration().then(() => process.exit(0))


