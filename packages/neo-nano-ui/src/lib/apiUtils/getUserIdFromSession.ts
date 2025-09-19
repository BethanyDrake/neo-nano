'use server'
import { SessionData } from "@auth0/nextjs-auth0/types"
import { NeonQueryFunction } from "@neondatabase/serverless"
import { getQueryFunction } from "@/lib/apiUtils/getQueryFunction"
import { auth0 } from "@/lib/auth0"

export const getUserId = async () => {
  const session = await auth0.getSession()
  const sql = getQueryFunction()
  return getUserIdFromSession(session, sql)
}

// TODO: deprececate, call getUserId instead
export const getUserIdFromSession = async (session: SessionData | null, sql: NeonQueryFunction<false, false>):Promise<string>  => {
      if (!session ) {
        throw new Error(`No session found`)
    }

    const external_id = session.user.sub
    const userIds = await sql`SELECT id FROM users 
      WHERE external_id=${external_id}
      LIMIT 1`

    if (userIds.length < 1) {
        throw new Error(`No user found with external_id=${external_id}`)
    }

    const userId = userIds[0].id

    if (typeof userId !== 'string') {
        throw new Error(`unexpected user id found`)
    }

    return  userId
    
}