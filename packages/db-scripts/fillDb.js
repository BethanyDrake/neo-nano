require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}`})
const { neon } = require('@neondatabase/serverless')
import('@faker-js/faker').then(({faker}) => {
  
require('./validate-environment')

const sql = neon(process.env.DATABASE_URL)

const createUsers = async () => {
  for (let i = 0; i < 5; i++) {
    await sql`insert into users (external_id, display_name, about_me) values 
            (${faker.string.uuid()}, ${faker.person.firstName()}, ${faker.lorem.lines()})
    ;`
  }

  const users = await sql`SELECT * FROM users`

  console.log('created users', users)
}

const createThreads = async () => {
  const users = await sql`SELECT id FROM users`
  const topics = await sql`SELECT id FROM topics limit 5`
  console.log(users, topics)
  console.log('initThreads start')

  for (let i = 0; i < 3; i++) {
    const userId = users[faker.number.int(users.length - 1)].id
    const createdThread = await sql`insert into threads (title, author, topic) values 
            (${faker.book.title()}, ${userId}, 'introductions')
            returning id
    ;`
    const commentText = faker.lorem.paragraph()
    await sql`insert into comments (comment_text, rich_text, author, thread) values
          (${commentText}, ${commentText} , ${userId}, ${createdThread[0].id})
        `
  }

  const threads = await sql`SELECT * FROM threads`

  console.log('created topics', threads)
}

const createComments = async () => {
  const users = await sql`SELECT id FROM users`
  const topics = await sql`SELECT id FROM topics`
  const threads = await sql`SELECT id FROM threads`
  console.log(users, topics)
  console.log('initThreads start')

  for (let i = 0; i < 30; i++) {
    const commentText = faker.lorem.paragraph()
    const userId = users[faker.number.int(users.length - 1)].id
    const threadId = threads[faker.number.int(threads.length - 1)].id
    await sql`insert into comments (comment_text, rich_text, author, thread) values
          (${commentText}, ${commentText} , ${userId}, ${threadId})
        `
  }

  const comments = await sql`SELECT * FROM comments`

  console.log('created comments', comments)
}

const fillDb = async () => {
  await createUsers()
  await createThreads()
  await createComments()
}

fillDb().then(() => process.exit(0))

})
