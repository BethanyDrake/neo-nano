const { neon } = require('@neondatabase/serverless');

/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  console.log("onExecutePostLogin")
  const databaseUrl = event.secrets["DATABASE_URL"]
  if (!databaseUrl) throw new Error("DATABASE_URL is not defined")
  const sql = neon(databaseUrl)
  const external_id = event.user.user_id
  const display_name = event.user.nickname ?? 'anonymous'
  console.log({external_id, display_name})

  const existingUsers = await sql`select id from users where external_id=${external_id} limit 1`

  let userId;
  if (existingUsers.length < 1) {
    const createdUsers = await sql`INSERT INTO users (external_id, display_name) 
      VALUES (${external_id}, ${display_name})
      returning id`

    userId=createdUsers[0].id
  } else {
    userId= existingUsers[0].id
  }

  
  api.user.setUserMetadata('user_id', userId)
  console.log({userId})
  console.log("onExecutePostLogin DONE")
};


/**
* Handler that will be invoked when this action is resuming after an external redirect. If your
* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
// exports.onContinuePostLogin = async (event, api) => {
// };
