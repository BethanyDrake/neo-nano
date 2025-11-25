import { PropsWithChildren, ReactNode } from "react"
import { LeftRow } from "../layoutElements/flexLayouts"
import Image from "next/image"

const Role = ({ children }: PropsWithChildren) => {
  return <div style={{ fontStyle: 'italic' }}>{children}</div>
}

const Name = ({ children }: PropsWithChildren) => {
  return <h3 style={{ paddingBottom: 0 }}>{children}</h3>
}

export const TeamMember = ({
  fullName,
  role,
  description,
  picture,
}: {
  fullName: string
  role: string
  description: ReactNode
  picture: string
}) => {
  return (
    <LeftRow style={{ flexWrap: 'wrap' }}>
      <Image
        style={{ border: '2px solid var(—primary-dark)', borderRadius: '8px' }}
        src={picture}
        alt={fullName}
        width={150}
        height={150}
      />

      <div style={{ minWidth: '250px', maxWidth: '600px' }}>
        {' '}
        <Name>{fullName}</Name>
        <Role>{role}</Role>
        <p>{description}</p>
      </div>
    </LeftRow>
  )
}

export const TechnologyItem = ({
  fullName,
  role,
  description,
  picture,
}: {
  fullName: string
  role: string
  description: ReactNode
  picture: string
}) => {
  return (
    <LeftRow style={{ flexWrap: 'wrap' }}>
      <Image className="darkmode-invert" src={picture} alt={fullName} width={100} height={100} />

      <div style={{ minWidth: '250px', maxWidth: '650px' }}>
        <Name>{fullName}</Name>
        <Role>{role}</Role>
        <p>{description}</p>
      </div>
    </LeftRow>
  )
}