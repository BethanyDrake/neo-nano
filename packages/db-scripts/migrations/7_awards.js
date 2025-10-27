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
    ('Seeds of Success', 'Wrote at least 1667 words on November 1st.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/seeds-of-success.svg', 'words', 1667, '2025-11-01', '2025-11-01'),
    ('Novelette', 'Wrote 10,000 words in November!', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/Novelette.svg', 'words', 10000, '2025-11-01', '2025-11-30'),
    ('Novella', 'Wrote 25,000 words in November!', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/Novella.svg', 'words', 25000, '2025-11-01', '2025-11-30'),
    ('I Wrote a Novel!', 'Wrote 50,000 words in November!', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/Novel.svg', 'words', 50000, '2025-11-01', '2025-11-30'),
    ('Consistency is Key', 'Wrote every day for the first week of November.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/Consistency%20is%20Key.svg', 'days', 7, '2025-11-01', '2025-11-07'),
    ('Keep on Climbing', 'Wrote on 20 different days during November.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/Keep%20on%20Climbing.svg', 'days', 20, '2025-11-01', '2025-11-30'),
    ('Each and Every Day', 'Wrote on every day during November.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/Each%20and%20Every%20day.svg', 'days', 30, '2025-11-01', '2025-11-30')
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
