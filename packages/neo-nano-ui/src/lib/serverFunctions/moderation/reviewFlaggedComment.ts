'use server'

import { getDbConnection } from '../_utils/getDbConnection'
import { getUserId } from '../_utils/getUserIdFromSession'
import { getIsModerator } from './getIsModerator'


export const refuteFlag = async (flagId: string) => {
    const isModerator = getIsModerator()
    if (!isModerator) {
        throw Error('only moderators can review flagged comments')
    }
 const sql = getDbConnection()
  const reviewdBy = await getUserId()

  await sql`
    UPDATE flags
    SET reviewed_by=${reviewdBy}, review_outcome='overruled'
    WHERE flags.id=${flagId}
  `
}

export const confirmFlag = async (flagId: string) => {
    const isModerator = getIsModerator()
    if (!isModerator) {
        throw Error('only moderators can review flagged comments')
    }
 const sql = getDbConnection()
  const reviewdBy = await getUserId()

  await sql`
    UPDATE flags
    SET reviewed_by=${reviewdBy}, review_outcome='confirmed'
    WHERE flags.id=${flagId}
  `
}