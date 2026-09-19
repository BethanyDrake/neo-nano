import styles from '@/lib/landingPage/page.module.css'
import { Row } from '@/lib/layoutElements/flexLayouts'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faBullseye, faChartLine, faComment, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const FeatureCard = ({
  title,
  caption,
  icon,
  color,
}: {
  title: string
  caption: string
  icon: IconProp
  color: string
}) => {
  return (
    <div className={styles['feature-card']}>
      <h3>{title}</h3>
      <FontAwesomeIcon color={color} size="8x" icon={icon} />
      <p>{caption}</p>
    </div>
  )
}

export const FeaturesSection = () => {
  return (
    <Row style={{ padding: '16px', overflow: 'scroll' }} justifyContent="left">
      <FeatureCard title="Track" caption={'Track your progress each day.'} icon={faChartLine} color={'#d1b1ec'} />
      <FeatureCard
        title="Set Goals"
        // caption={'Aim for 50,000 words in November, or create a custom goal.'}
        // caption={'Aim for 80 hours in the new year, or create a custom goal.'}
        caption={'Aim for 15,000 words in the July, or create a custom goal.'}
        icon={faBullseye}
        color={'#1ab394'}
      />
      <FeatureCard
        title="Earn Awards"
        caption={'Celebrate the little wins with trophies along the way.'}
        icon={faTrophy}
        color={'#6e1ab3'}
      />
      <FeatureCard
        title="Socialise"
        caption={"When you're done writing for the day, come hang out in the forums 🤗"}
        icon={faComment}
        color={'#C0E5C8'}
      />
    </Row>
  )
}
