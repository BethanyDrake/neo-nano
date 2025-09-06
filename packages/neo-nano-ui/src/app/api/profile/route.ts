import { auth0 } from "@/lib/auth0"
import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"
import snakecaseKeys from 'snakecase-keys'
import camelcaseKeys from 'camelcase-keys';

if (!process.env.DATABASE_URL) throw Error('DATABASE_URL not defined.')
const sql = neon(process.env.DATABASE_URL)


export const GET = async function getMyProfile() {
  try {
    
    const session = await auth0.getSession()
    const external_id = session?.user.sub
    const result = await sql`SELECT id, display_name, about_me FROM users 
    WHERE external_id=${external_id}
    LIMIT 1`

    if (result.length <1) 
        throw Error("Profile not found")


    return NextResponse.json({profile: camelcaseKeys(result[0])})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}


export const POST = async function updateProfile(req: NextRequest) {
  try {
    
    const session = await auth0.getSession()
    const external_id = session?.user.sub
    console.log("updateProfile")
    const body = await req.json()
    const {display_name, about_me} = snakecaseKeys(body)
    const result = await sql`update users set display_name=${display_name}, about_me=${about_me}
    where external_id=${external_id} returning id, display_name, about_me`



    return NextResponse.json({profile: camelcaseKeys(result[0])})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}

