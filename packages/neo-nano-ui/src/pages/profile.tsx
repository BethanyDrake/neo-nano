import { WordsPerDay } from '@/lib/charts/WordsPerDay'
import { Centered, Row } from '@/lib/layout'
import { UpdateWordCount } from '@/lib/UpdateWordCount'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { User } from '@auth0/nextjs-auth0/types'
import axios from 'axios'
import { useEffect, useState } from 'react'

type  GoalProps ={
  id: string | number
  title: string
  initialRecords: number[]
}

const Goal = ({id, title, initialRecords}: GoalProps) => {
  const [records, setRecords] = useState<number[]>(initialRecords)

  const onCancel = () => {
    setRecords(initialRecords)
  }
 const onSave = () => {
    return axios.put(`/api/goals/${id}`, {records}).then(() => {
      console.log("Successfuly updated!")
    })
  }
  
  return (
   <div style={{padding: '16px'}}>
    <Centered>
            <h2>{title}</h2>
          </Centered>
          <Row>
        <UpdateWordCount onCancel={onCancel} onSave={onSave} records={records} setRecords={setRecords}/>
       <WordsPerDay  title={title} wordCountPerDay={records}/></Row></div>)
}


export const ProfilePage = ({ user }: { user: User }) => {
  const joinChallenge = async () =>  await axios.post(`/api/goals`)
  const [goals, setGoals] = useState([])

  useEffect(() => {
    axios.get(`/api/goals`).then((data) => {
      setGoals(data.data.goals)
    })
  },[])

  return (
    <>
      <h1>My Profile</h1>
      <p>{user.name}</p>
      <button onClick={joinChallenge}>Join the challenge</button>

      {goals.map(({id, title, records}) => <Goal id={id} key={id} title={title} initialRecords={records}/>)
      }
     
    </>
  )
}

const ProtectedProfilePage = withPageAuthRequired(ProfilePage)

export default ProtectedProfilePage
