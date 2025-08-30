import { WordsPerDay } from '@/lib/charts/WordsPerDay'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { User } from '@auth0/nextjs-auth0/types'
import axios from 'axios'
import { useEffect, useState } from 'react'


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

      {goals.map(({id, title, records}) => (
       <WordsPerDay key={id} title={title} wordCountPerDay={records}/>))
      }
     
    </>
  )
}

const ProtectedProfilePage = withPageAuthRequired(ProfilePage)

export default ProtectedProfilePage
