require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('./validate-environment')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const insertAwards = async () => {


  await sql`insert into awards (title, description, image_url, requirement_unit, requirement_value, start_date, end_date) values
    ('First Day', 'Wrote at least 1667 words on November 1st', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/starting%20strong.svg', 'words', 1667, '2025-11-01', '2025-11-01'),
    ('Day two', 'Wrote at least 1 word on November 2nd.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/seeds-of-success.svg', 'words', 1, '2025-11-02', '2025-11-02'),
        ('10K', 'Wrote 10K in the first week.', 'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/badges/seeds-of-success.svg', 'words', 10000, '2025-11-01', '2025-11-07')
    ;`
 

  const awards = await sql`select * from awards`
  console.log(awards)
}


insertAwards().then(() => process.exit(0))
