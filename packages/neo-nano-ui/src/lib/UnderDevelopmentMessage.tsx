import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Centered } from './layoutElements/flexLayouts'
import { faTools } from '@fortawesome/free-solid-svg-icons'

export const UnderDevelopmentMessage = ({upcomingChanges}: {upcomingChanges: string[]}) => {
  return (
    <div style={{ backgroundColor: 'var(--secondary-light)', padding: '10px 20px' }}>
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
        {upcomingChanges.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  )
}
