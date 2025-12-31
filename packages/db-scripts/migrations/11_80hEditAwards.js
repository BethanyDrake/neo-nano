require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const addAwards = async () => {
    await sql`ALTER TYPE requirement_unit ADD VALUE IF NOT EXISTS 'minutes';`;

  await sql`insert into awards (title, description, image_url, requirement_unit, requirement_value, start_date, end_date) values
    ('Total of Ten', 'It takes 10 hours to read a novel out loud. How long does it take to edit one?', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/80h-edit/10h.png', 'minutes', 10*60, '2026-01-01', '2026-03-01'),
    ('Whole Day of Edits', 'Edited for 24 hours straight. Or with breaks.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/80h-edit/24h.png', 'minutes', 24*60, '2026-01-01', '2026-03-01'),
    ('Climbing the Stacks', 'Spent 40 hours fine-tuning a manuscript.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/80h-edit/40h.png', 'minutes', 40*60, '2026-01-01', '2026-03-01'),
    ('Stylistic Sixty', 'Spent 60 hours refining your style.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/80h-edit/60h.png', 'minutes', 60*60, '2026-01-01', '2026-03-01'),
    ('Eighty Hour Edit', 'Completed the 2026 80 Hour Edit!', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/80h-edit/80h.png', 'minutes', 80*60, '2026-01-01', '2026-03-01')
    ;
 `

  const awards = await sql`select * from awards`
  console.log(awards)
}

const doMigration = async () => {
  await addAwards()
}

doMigration().then(() => process.exit(0))
