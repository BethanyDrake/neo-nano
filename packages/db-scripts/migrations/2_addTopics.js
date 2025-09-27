require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon } = require('@neondatabase/serverless')
require('../validate-environment')

const sql = neon(process.env.DATABASE_URL)

const deleteLegacyCraftOfWriting = async () => {
   await sql`delete from topics
        where category='craftOfWriting' ` 
    await sql`delete from categories
        where id='craftOfWriting'   `
}

const addCategories = async () => {
  await sql`insert into categories (id, title) values 
        ('general', 'General'), 
        ('craft-of-writing', 'Craft of Writing'),
        ('planning',	'Planning'),
        ('genres',	'Genres'),
        ('restricted',	'The Restricted Section (Coming Soon)')
    ON CONFLICT DO NOTHING`

    const categories = (await sql`select * from categories`)
    console.log({categories})
}

const addTopics= async () => {
  await sql`insert into topics (id, title, description, icon, category) values 
('grammar','Grammar','A place for debating the proper use of a semicolon, or finally figure out what a past participle is.','faSpellCheck', 'craft-of-writing'),
('voice','Voice','It''s not about what''s right, it''s about what sounds good.','faMusic', 'craft-of-writing'),
('dialogue','Dialogue','"Dialogue is easy,"" they said.','faComments','craft-of-writing'),
('structure-and-pacing','Structure/Pacing','How the different parts of a novel should fit together.', 'faFolderTree' ,'craft-of-writing'),
('description','Description','Y''know, what things look like.','faPalette', 'craft-of-writing'),
('questions','Questions','How do I...? What should I...? Why can''t I...?','faQuestion', 'general'),
('progress','Progress Updates','Comiseration, celebration, and accountability.', 'faChartLine','general'),
('meta','Meta','Discussion regarding novel-noveber.com, including feature requests, bug reports, and suggestions for new forum topics.','faAtom','general'),
('fun-and-games','I should be writing but...','A place for forum games or non-writing related chat.', 'faGamepad','general'),
('undecided','What''s my genre?','For the undecided and unsure.','faSignsPost','genres')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon, category = EXCLUDED.category;
`

  await sql`insert into topics (id, title, description, icon, category) values 
('character', 'Character', 'Emotional development, interpersonal conflict, personal growth. Character sheets and roleplay welcome here. ', 'faPerson', 'planning'),
('setting', 'Setting', 'Physcial environment, political context, and society at large.', 'faMap', 'planning'),
('plot', 'Plot', 'Things that happen. I hear novels should have those. ', 'faExplosion', 'planning'),
('reseach', 'Reseach', 'It''s not "going down a rabbit hole" if rabbits are key to your story. ', 'faMagnifyingGlass', 'planning'),
('tools', 'Tools', 'Save the cat, snowflake method, red string and thumbtacks — share whatever works for you. ', 'faHammer', 'planning')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon, category = EXCLUDED.category;
`

  await sql`insert into topics (id, title, description, icon, category) values 
('romance', 'Romance','Please keep discussions suitable for all ages. For the steamier aspects of romance, head over to the restricted section!','faHeart', 'genres'),
('fantasy', 'Fantasy','Monsters and magic, dragons and vampires, portals to other worlds. ','faDragon', 'genres'),
('sci-fi', 'Sci-fi','Space exploration, genetically engineered dinosaurs, deep sea cryptids, and zobification viruses.','faStar', 'genres'),
('horror', 'Horror','If it gives you chills, put it here. Keep discussions suitable for all ages — spooky and scary is good, but graphic descriptions of violence belong in the restricted section. ','faGhost', 'genres'),
('mystery','Mystery','Your book is a puzzle and every word is a clue. ', 'faPuzzlePiece','genres'),
('children', 'Children''s','Children can be the toughest critics. Know what you''re getting into!','faChild','genres'),
('historical', 'Historical','If it takes place in the past, it counts. ','faHourglass','genres'),
('non-fiction','Non-fiction','Memoirs, biographies, true crime, phd theses. ','faClipboard', 'genres'),
('adventure', 'Adventure','Exploration! Explosions! ','faTree', 'genres'),
('literary','Literary','For examining the human condition.','faGraduationCap', 'genres')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon, category = EXCLUDED.category;
`

    const topics = (await sql`select * from topics`)
    console.log({topics})
}

const doScript = async () => {
  await deleteLegacyCraftOfWriting()
  await addCategories()
  await addTopics()
}

doScript().then(() => process.exit(0))
