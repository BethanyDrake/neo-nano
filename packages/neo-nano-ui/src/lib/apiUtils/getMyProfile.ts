"use server"
import { auth0 } from "@/lib/auth0"
import { Profile } from "@/lib/forum.types"
import { neon } from "@neondatabase/serverless"
import camelcaseKeys from 'camelcase-keys'

if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)

export const getMyProfile = async (): Promise<Profile> => {
   const session = await auth0.getSession()
    console.log("getMyProfile", session)
    const external_id = session?.user.sub
    const result = await sql`SELECT id, display_name, about_me FROM users 
    WHERE external_id=${external_id}
    LIMIT 1`

    if (result.length <1) 
        throw Error("Profile not found")


    return camelcaseKeys(result[0]) as Profile
}