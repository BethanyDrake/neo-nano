import { UserAward } from '@/lib/profile.types'
import { Column } from '../layoutElements/flexLayouts'
import Image from 'next/image'

export const Trophy = ({ award }: { award: UserAward }) => {
  return (
    <Column style={{ textAlign: 'center' }} alignItems="center">
      <h3>{award.title}</h3>
      <Image src={award.imageUrl} alt={award.title} width={200} height={200} />
      <p>{award.description}</p>
      <strong>
        {award.awardedAt.toLocaleString(undefined, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })}
      </strong>
    </Column>
  )
}
