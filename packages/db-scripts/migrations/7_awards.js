require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const initAwards = async () => {
  await sql`drop table if exists user_awards`
  await sql`drop table if exists awards`
  await sql`drop type if exists requirement_unit`
  await sql`CREATE TYPE requirement_unit AS ENUM ('words', 'days', 'comments')`

  await sql`create table awards (
 id bigint primary key GENERATED ALWAYS AS IDENTITY,
 title text,
 description text,
 image_url text,
 requirement_unit requirement_unit,
 requirement_value int,
 start_date date,
 end_date date
 )`

  await sql`insert into awards (title, description, image_url, requirement_unit, requirement_value, start_date, end_date) values
    ('Starting Strong', 'Wrote at least 10,000 words in the first week of November', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/starting%20strong.svg', 'words', 10000, '2025-11-01', '2025-11-07'),
    ('Seeds of Success', 'Wrote at least 1667 words on November 1st.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/seeds-of-success.svg', 'words', 1667, '2025-11-01', '2025-11-01')
    ;
 `

   
  await sql`create table user_awards (
    awarded_to bigint REFERENCES users(id),
    award bigint REFERENCES awards(id),
    awarded_at TIMESTAMPTZ DEFAULT Now(),
    PRIMARY KEY(awarded_to, award)
)
 `

  const awards = await sql`select * from awards`
  console.log(awards)
}

const doMigration = async () => {
  await initAwards()
}

doMigration().then(() => process.exit(0))
