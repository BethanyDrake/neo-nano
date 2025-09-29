const { neon } = require('@neondatabase/serverless')

/**
 * Handler that will be called during the execution of a PostUserRegistration flow.
 *
 * @param {Event} event - Details about the context and user that has registered.
 * @param {PostUserRegistrationAPI} api - Methods and utilities to help change the behavior after a signup.
 */
exports.onExecutePostUserRegistration = async (event, api) => {
  try {
  console.log("onExecutePostUserRegistration start")

  const databaseUrl = event.secrets['DATABASE_URL']
  if (!databaseUrl) throw new Error('DATABASE_URL is not defined')
  
  console.log("Found DATABASE_URL", databaseUrl.slice(databaseUrl.indexOf('@')))

  const sql = neon(databaseUrl)
  console.log("connected to db")
  const external_id = event.user.user_id
  const display_name = event.user.nickname ?? 'anonymous'
  console.log({external_id, display_name})
  await sql`INSERT INTO users (external_id, display_name) 
      VALUES (${external_id}, ${display_name})
      ON CONFLICT (external_id) DO NOTHING`

  console.log("DONE")
  } catch(error) {
    console.error(error)
  }
}
