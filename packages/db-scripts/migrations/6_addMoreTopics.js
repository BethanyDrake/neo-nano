require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon } = require('@neondatabase/serverless')
require('../validate-environment')

const sql = neon(process.env.DATABASE_URL)

const addCategories = async () => {
    await sql`delete from categories
        where id='restricted' `

await sql`delete from topics where id='reseach'`

  await sql`insert into categories (id, title) values 
        ('coffeehouse', 'The Coffeehouse'),
         ('restricted',	'The Restricted Section (Coming Soon)')
    ON CONFLICT DO NOTHING`

    const categories = (await sql`select * from categories`)
    console.log({categories})
}

const addTopics= async () => {
  await sql`insert into topics (id, title, description, icon, category) values 
('experts', 'Experts', 'Are you an expert looking to share your amazing experiences? This is the place for you.', 'faBrain', 'planning'),
('research', 'Research', 'Looking for someone who has personal experience with your research topic? Ask here!', 'faMagnifyingGlass', 'planning'),
('ideas', 'Idea Orphanage', 'All the adoptables you could ever need. Find an abandoned plot, a character, a title, or even a catchphrase at your One-Stop Adoption Shop!', 'faLightbulb', 'planning'),
('setting', 'Worldbuilding', 'For those who make worlds from scratch, we support you. Get help with the ecosystems of your fantasy world, the engineering of your faster-than-light spaceship, or the architecture of Everytown, USA.', 'faMap', 'planning'),
('naming', 'Appelation Station', 'Don''t know what to name your main character''s third uncle? Have a place that needs a better moniker than "MC''s Home Town"? Can''t find the title that will make your novel a bestseller? Appellation Station is the place where all of our naming experts gather.', 'faSignature', 'planning'),
('character', 'Characters', 'Whether you can''t figure out why your villain is unrelatable, or need to know what job would best suit a fairy looking to pay her way through college, this is your home for all things character.', 'faPerson', 'planning'),
('book-recs', 'What are you reading?', 'Book recommendations perfect to start over a freshly brewed espresso.', 'faBookOpen', 'coffeehouse'),
('fun-and-games','I should be writing but...','A place for forum games or non-writing related chat.', 'faGamepad','coffeehouse')

ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon, category = EXCLUDED.category;
`
    const topics = (await sql`select * from topics`)
    console.log({topics})
}

const doScript = async () => {
  await addCategories()
  await addTopics()
}

doScript().then(() => process.exit(0))
