require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon } = require('@neondatabase/serverless');
require('../validate-environment')

const sql = neon(process.env.DATABASE_URL);


const doMigration = async () => {
    await sql`drop type if exists visibility`;
    await sql`CREATE TYPE visibility AS ENUM ('private', 'public')`;
    await sql`ALTER TABLE goals DROP COLUMN IF EXISTS visibility`;
    await sql`ALTER TABLE goals ADD COLUMN visibility visibility DEFAULT 'private'`;

}

doMigration().then(() => process.exit(0))