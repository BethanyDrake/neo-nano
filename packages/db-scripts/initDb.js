require('dotenv').config()
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
    console.log("missing DATABASE_URL")
    process.exit(1)
}

const sql = neon(process.env.DATABASE_URL);

const initCategories = async () => {
    console.log("initCategories start")
    await sql`drop table if exists categories cascade`;
    await sql`CREATE TABLE  categories (
        id varchar(128) PRIMARY KEY,
        title text
    )`;

    await sql`insert into categories (id, title) values 
        ('general', 'General'), 
        ('craftOfWriting', 'Craft of Writing');`

    const categories = await sql`SELECT * FROM categories`;

    console.log("created categories", categories)
}

const initTopics = async () => {
    console.log("initTopics start")
    await sql`drop table if exists topics cascade`;
    await sql`CREATE TABLE topics (
        id varchar(128) PRIMARY KEY,
        title text,
        description text,
        icon text,
        category varchar(128) REFERENCES categories(id)
    );`;

    await sql`insert into topics (id, title, description, icon, category) values 
        ('appelationStation', 'Appelation Station', 'Character names, novel titles, and all other proper nouns.', 'faPerson', 'craftOfWriting'),
        ('planning', 'Planning', 'World building, character sheets, save-the-cat, all planning progress and problems go here.', 'faPenFancy', 'craftOfWriting'),
        ('generalDiscussion', 'General Discussion', 'For anything without a dedicated topic... or when your brain is too fried to find the right place.', 'faShield', 'general'),
        ('introductions', 'Introductions', 'Introduce yourself, your project, and your cat (optional).', 'faBoltLightning', 'general')
  ;`

    const topics = await sql`SELECT * FROM topics`;

    console.log("created topics", topics)
}




const initUsers = async () => {
    console.log("initUsers start")
    await sql`drop table if exists users cascade`;
    await sql`create table users (
      id bigint primary key GENERATED ALWAYS AS IDENTITY,
      external_id varchar(128) UNIQUE,
      display_name text,
      about_me text
);`;

}

const initThreads = async () => {
    console.log("initThreads start")
    await sql`drop table if exists threads cascade`;
    await sql`CREATE TABLE threads (
  id bigint primary key GENERATED ALWAYS AS IDENTITY,
  title text,
  author bigint REFERENCES users(id),
  topic varchar(128) REFERENCES topics(id)
);`;

}

const initComments = async () => {
    console.log("initComments start")
    await sql`drop table if exists comments cascade`;
    await sql`CREATE TABLE comments (
  id bigint primary key GENERATED ALWAYS AS IDENTITY,
  comment_text text,
  rich_text text,
  author bigint REFERENCES users(id),
  thread bigint REFERENCES threads(id)
);`;

}

const initGoals = async () => {
    await sql`drop table if exists goals cascade`;
    await sql`create table goals (
    id bigint primary key GENERATED ALWAYS AS IDENTITY,
    title text,
    target int,
    start_date date,
    length_days int,
    records int[],
    user_id bigint REFERENCES users(id))`
}

const initFlags = async () => {

    await sql`drop table if exists flags`
    await sql`drop type if exists reason`
    await sql`CREATE TYPE reason AS ENUM ('sexual-content', 'harrassment', 'spam','other')`;
 await sql`create table flags (
 id bigint primary key GENERATED ALWAYS AS IDENTITY,
 comment bigint REFERENCES comments(id),
 reported_by bigint REFERENCES users(id),
 created_at TIMESTAMPTZ DEFAULT Now(),
 reason reason,
 details text
 )`

}

const initDB = async () => {
    await initCategories()
    await initTopics()
    await initUsers()
    await initThreads()
    await initComments()
    await initGoals()
    await initFlags()
}


initDB().then(() => process.exit(0))


console.log((process.env.DATABASE_URL))