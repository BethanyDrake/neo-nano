require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const addAwards = async () => {

  await sql`insert into awards (title, description, image_url, requirement_unit, requirement_value, start_date, end_date) values
    ('Seeds of Success', 'Wrote at least 1667 words on November 1st.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/nov2026/Seeds-of-success-2.png', 'words', 1667, '2026-11-01', '2026-11-01'),
    ('Novelette', 'Wrote 10,000 words in November!', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/nov2026/Novelette.png', 'words', 10000, '2026-11-01', '2026-11-30'),
    ('Novella', 'Wrote 25,000 words in November!', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/nov2026/Novella.png', 'words', 25000, '2026-11-01', '2026-11-30'),
    ('I Wrote a Novel!', 'Wrote 50,000 words in November!', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/nov2026/Novel.png', 'words', 50000, '2026-11-01', '2026-11-30'),
    ('Consistency is Key', 'Wrote every day for the first week of November.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/nov2026/Consistency-is-Key.png', 'days', 7, '2026-11-01', '2026-11-07'),
    ('Keep on Climbing', 'Wrote on 20 different days during November.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/nov2026/Keep-on-Climbing.png', 'days', 20, '2026-11-01', '2026-11-30'),
    ('Each and Every Day', 'Wrote on every day during November.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/nov2026/Each-and-Every-day.png', 'days', 30, '2026-11-01', '2026-11-30')
    ;
 `

  const awards = await sql`select * from awards`
  console.log(awards)
}

const doMigration = async () => {
  await addAwards()
}

doMigration().then(() => process.exit(0))
