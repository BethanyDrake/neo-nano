# Delete a user

## Scenario:
A user wants to delete their account, including all their goals, projects, trophies, etc.

## Steps:

### step 1: run deletion script

From the db utils directory, run:
`DOTENV_PATH=prod node deleteUser <user-id>`

### step 2: remove from auth0

In auth0 -> user management, delete the user.

### step 3: unsubscribe from emails

In email octopus -> view contacts, delete the user. 

## Outcome

- The user's profile will no longer be visible.
- all the user's comments will be 'deleted'
- when viewing the audit log of the deleted comments, the author will show up as 'deleted user'
- if the user tries to sign in again with a new email address, a new account will be created