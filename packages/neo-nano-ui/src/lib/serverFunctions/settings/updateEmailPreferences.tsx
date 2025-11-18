'use server'
import { auth0 } from '@/lib/auth0'
import axios from 'axios'

type EmailPreferences = {
  recieveChallengeReminders: boolean
  revieveEncouragmentEmails: boolean
}

export const updateEmailPreferences = async ({
  recieveChallengeReminders,
  revieveEncouragmentEmails,
}: EmailPreferences) => {
  const email = (await auth0.getSession())?.user?.email
  if (!email) {
    throw Error('email not found in user session.')
  }

  const status = recieveChallengeReminders || revieveEncouragmentEmails ? 'subscribed' : 'unsubscribed'

  const body = {
    email_address: email,
    fields: {},
    tags: {
      challenge_reminders: recieveChallengeReminders,
      encouragment: revieveEncouragmentEmails,
    },
    status: status,
  }

  await axios.put(`https://api.emailoctopus.com/lists/${process.env.EMAIL_OCTOPUS_LIST_ID}/contacts`, body, {
    headers: {
      Authorization: `Bearer ${process.env.EMAIL_OCTOPUS_API_TOKEN}`,
    },
  })

  return
}
