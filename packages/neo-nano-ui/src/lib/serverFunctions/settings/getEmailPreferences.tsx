'use server'
import { auth0 } from '@/lib/auth0'
import axios from 'axios'
import md5 from 'md5'

export type EmailPreferences = {
  recieveChallengeReminders: boolean
  revieveEncouragmentEmails: boolean
}

export const getEmailPreferences = async (): Promise<EmailPreferences> => {
  const email = (await auth0.getSession())?.user?.email
  if (!email) {
    throw Error('email not found in user session.')
  }
  const contactId = md5(email.toLocaleLowerCase())

  
  const {data} = await axios.get(`https://api.emailoctopus.com/lists/${process.env.EMAIL_OCTOPUS_LIST_ID}/contacts/${contactId}`, {
    headers: {
      Authorization: `Bearer ${process.env.EMAIL_OCTOPUS_API_TOKEN}`,
    },
  })

  console.log("data", data)

  const tags: string[] = data.tags ?? []
  

  return {
    recieveChallengeReminders: tags.includes('challenge_reminders'),
    revieveEncouragmentEmails: tags.includes('encouragement')
  }

}
