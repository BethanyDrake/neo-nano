require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon } = require('@neondatabase/serverless');
require('../validate-environment')

const sql = neon(process.env.DATABASE_URL);


const doMigration = async () => {
    await sql`drop type if exists role`
    await sql`CREATE TYPE role AS ENUM ('moderator', 'user')`;
    await sql`ALTER TABLE users DROP COLUMN IF EXISTS role`;
    await sql`ALTER TABLE users ADD COLUMN role role DEFAULT 'user'`;

}

doMigration().then(() => process.exit(0))
