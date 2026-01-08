import { UserAward } from '@/lib/types/profile.types'
import { Column } from '../layoutElements/flexLayouts'
import Image from 'next/image'
import { ClientSideOnly } from '../ClientSideOnly'
import { TextLinePlaceHolder } from '../layoutElements/Placeholders'

export const Trophy = ({ award }: { award: UserAward }) => {
  return (
    <Column style={{ textAlign: 'center' }} alignItems="center">
      <h3>{award.title}</h3>
      <Image preload src={award.imageUrl} alt={award.title} width={200} height={200} />
      <p>{award.description}</p>
      <strong>
         <ClientSideOnly fallback={<TextLinePlaceHolder/>}>
        {award.awardedAt.toLocaleString(undefined, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })}
        </ClientSideOnly>
      </strong>
    </Column>
  )
}