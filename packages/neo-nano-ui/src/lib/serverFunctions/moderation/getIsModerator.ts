'use server'

import { auth0 } from '@/lib/auth0'
import { getQueryFunction } from '../_utils/getQueryFunction'
import { Profile } from '@/lib/forum.types'
import { getSingle } from '../_utils/getSingle'

export const getIsModerator = async () => {
  const session = await auth0.getSession()
  if (!session) return false
  const sql = getQueryFunction()
  const external_id = session?.user.sub

  await sql`select role from users where external_id=${external_id}
  ;`

  try {
  const { role } = (await getSingle(
    'user',
    sql`select role from users where external_id=${external_id}
  ;`,
  )) as Profile

    return role === 'moderator'
  } catch (error) {
    console.error(error)
    return false
  }
}
