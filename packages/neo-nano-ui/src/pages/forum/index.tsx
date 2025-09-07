import { Column, Row } from '@/lib/layout'
import styles from './index.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Category } from '@/lib/forum.types'
import axios from 'axios'

const ForumItem = ({
  topicId,
  title,
  icon,
  description,
}: {
  topicId: string
  title: string
  icon: IconProp
  description: string
}) => {
  return (
    <div className={styles['forum-item']}>
      <Row justifyContent="left">
        <Column>
          <div className={styles['forum-icon']}>
            <FontAwesomeIcon icon={icon} />
          </div>
        </Column>
        <Column>
          <a href={`forum/${topicId}`} className={styles['forum-item-title']}>
            {title}
          </a>
          <div className={styles['forum-sub-title']}>{description}</div>
        </Column>
      </Row>
    </div>
  )
}

type ForumProps = {
  categories: Category[]
}
export const Forum = ({ categories }: ForumProps) => {
  return (
    <div className={styles['forum-container']}>
      {categories.map(({ id, title, topics }) => {
        return (
          <div key={id}>
            <h2>{title}</h2>
            {topics.map(({ id, title, description, icon }) => {
              return <ForumItem key={id} topicId={id} title={title} description={description} icon={Icons[icon]} />
            })}
          </div>
        )
      })}
    </div>
  )
}

Forum.getInitialProps = async () => {
  const { categories } = (await axios.get<{ categories: Category[] }>(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/topics`)).data
  return { categories }
}

export default Forum
