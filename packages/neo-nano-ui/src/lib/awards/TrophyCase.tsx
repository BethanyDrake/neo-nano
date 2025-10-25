import { UserAward } from '@/lib/profile.types'
import { Centered, Column, Row } from '../layout'
import Image from 'next/image'
import classNames from './awards.module.css'

export const Trophy = ({ award }: { award: UserAward }) => {
  return (
    <div className={classNames.card}>
      <Column alignItems="center">
        {' '}
        <h3>{award.title}</h3>
        <Image src={award.imageUrl} alt={award.title} width={200} height={200} />
        <p>{award.description}</p>
      </Column>
    </div>
  )
}

export const TrophyCase = ({ awards }: { awards: UserAward[] }) => {
  return (
    <div>
      <Centered>
        <h2>Trophy Case</h2>
      </Centered>
      <Row style={{ padding: '16px' }} justifyContent="left">
        {awards.map((award) => (
          <Trophy key={award.id} award={award} />
        ))}
      </Row>
    </div>
  )
}
