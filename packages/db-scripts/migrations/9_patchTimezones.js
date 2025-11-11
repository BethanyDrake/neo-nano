require('dotenv').config({ path: `.env.${process.env.DOTENV_PATH}` })
const { neon, types } = require('@neondatabase/serverless')
require('../validate-environment')
const _ = require('lodash')
types.setTypeParser(1082, (value) => value)

const sql = neon(process.env.DATABASE_URL)

const getStats = (goals) => ({
    count: goals.length, 
    lengths: _.sum(goals.map(({records}) => records.length)),
  total: _.sum(goals.map(({records}) => _.sum(records)))})

const doMigration = async () => {
  const goals = await sql`select * from goals`;
  console.log("all goals", getStats(goals))

  const novemberGoals = goals.filter(({ start_date, length_days}) => start_date === '2025-11-01' && length_days >= 2)
  console.log("novemberGoals", getStats(novemberGoals))

  const potentials = novemberGoals.filter(({records}) => records[0] === null && records[1] !==null)
  console.log("potentials", getStats(potentials))

  const updated = potentials.map(({id, records}) => ({
    id, records: _.concat(records.slice(1), [null])
  }))
  console.log("updated", getStats(updated))

  await Promise.all(updated.map(({id, records}) => {
    return sql`update goals set records=${records} where id=${id} `
  }))

  const allUpdatedGoals = await sql`select * from goals`;
  console.log("allUpdatedGoals", getStats(allUpdatedGoals))
}

doMigration().then(() => process.exit(0))
