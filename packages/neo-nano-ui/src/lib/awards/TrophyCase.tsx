import { UserAward } from '@/lib/profile.types'
import { Centered, Row } from '../layoutElements/flexLayouts'
import classNames from './awards.module.css'
import { Trophy } from './Trophy'

export const TrophyCard = ({ award }: { award: UserAward }) => {
  return (
    <div className={classNames.card}>
     <Trophy award={award}/>
    </div>
  )
}

export const TrophyCase = ({ awards }: { awards: UserAward[] }) => {
  return (
    <div>
      <Centered>
        <h2>Trophy Case</h2>
      </Centered>
      {awards.length > 0 ? (<Row style={{ padding: '16px', overflow: 'scroll' }} justifyContent="left">
        {awards.map((award) => (
          <TrophyCard key={award.id} award={award} />
        ))}
      </Row> ): <Centered><p style={{padding: '10px', fontStyle:'italic'}}>No trophies so far. Update your progress to earn awards!</p></Centered>}
    </div>
  )
}
