import { WordsPerDay } from '@/lib/charts/WordsPerDay'
import { UpdateWordCount } from '@/lib/UpdateWordCount'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { User } from '@auth0/nextjs-auth0/types'
import axios from 'axios'
import { useEffect, useState } from 'react'

const Goal = ({title, initialRecords}) => {
  const [records, setRecords] = useState<number[]>(Array(30).fill(0))
  
  return (
   <div>
        <UpdateWordCount records={records} setRecords={setRecords}/>
       <WordsPerDay  title={title} wordCountPerDay={records}/></div>)
}


export const ProfilePage = ({ user }: { user: User }) => {
  const joinChallenge = async () =>  await axios.post(`/api/goals`)
  const [goals, setGoals] = useState([])

  useEffect(() => {
    axios.get(`/api/goals`).then((data) => {
      console.log(data)
      setGoals(data.data.goals)
    })
  },[])
  return (
    <>
      <h1>My Profile</h1>
      <p>{user.name}</p>
      <button onClick={joinChallenge}>Join the challenge</button>

      {goals.map(({id, title, records}) => <Goal key={id} title={title} initialRecords={records}/>)
      }
     
    </>
  )
}

const ProtectedProfilePage = withPageAuthRequired(ProfilePage)

export default ProtectedProfilePage
