import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Centered } from './layoutElements/flexLayouts'
import { faTools } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { DotiContainer } from './layoutElements/dotiContainer'

export const UnderDevelopmentMessage = ({upcomingChanges}: {upcomingChanges: {description: string, issueId: number}[]}) => {
  return (
    <DotiContainer >
      <Centered>
        <h2>
          <FontAwesomeIcon icon={faTools} /> In Progress <FontAwesomeIcon icon={faTools} />
        </h2>
      </Centered>
      <p>
        This page is under development. Feel free to try it out, but it may not work very well! Expect frequent tweaks.
      </p>
      
      <h3>Upcoming changes:</h3>
      <ul style={{ paddingLeft: '20px' }}>
        {upcomingChanges.map((item) => <li key={item.issueId}>
          <Link href={`https://github.com/BethanyDrake/neo-nano/issues/${item.issueId}`}> {item.description}</Link>
          
         
          </li>)}
      </ul>
    </DotiContainer>
  )
}
