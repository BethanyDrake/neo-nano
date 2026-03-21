import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import { DotiContainer } from '@/lib/layoutElements/dotiContainer'
import { Centered } from '@/lib/layoutElements/flexLayouts'

export const DateSafetyMessage = () => {
  return (
    <DotiContainer >
      <Centered>
        <h2>
          <FontAwesomeIcon icon={faShieldHalved}  /> Data Security  <FontAwesomeIcon icon={faShieldHalved}  />
        </h2>
      </Centered>
      <p>
        All analysis is performed within the browser. This means your writing never leaves your computer. Neither your text nor the resulting analytics are transmitted, stored, or accessible to anyone other than you.
      </p>
    </DotiContainer>
  )
}
