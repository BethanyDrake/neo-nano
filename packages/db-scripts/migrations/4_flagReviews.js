require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon } = require('@neondatabase/serverless');
require('../validate-environment')

const sql = neon(process.env.DATABASE_URL);


const doMigration = async () => {
    await sql`drop type if exists review_outcome`
    await sql`CREATE TYPE review_outcome AS ENUM ('confirmed', 'overruled')`;
    await sql`ALTER TABLE flags DROP COLUMN IF EXISTS reviewed_by`;
    await sql`ALTER TABLE flags DROP COLUMN IF EXISTS reviewed_outcome`;
    await sql`ALTER TABLE flags ADD COLUMN reviewed_by bigint REFERENCES users(id)`;
    await sql`ALTER TABLE flags ADD COLUMN review_outcome review_outcome`;

}

doMigration().then(() => process.exit(0))