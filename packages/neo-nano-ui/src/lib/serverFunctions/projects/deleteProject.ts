'use server'

import { getQueryFunction } from '../_utils/getQueryFunction'
import { getUserId } from '../_utils/getUserIdFromSession'


export const deleteProject = async (id: string):Promise<void> => {
  console.log('deleteProject')
  const sql = getQueryFunction()
  const user_id = await getUserId()

  await sql`DELETE FROM projects WHERE user_id=${user_id} AND id=${id}`

}
