import { Centered, Column, Row } from '../layoutElements/flexLayouts'
import styles from './page.module.css'
import { FeaturedProjectResponse } from '../serverFunctions/projects/getFeaturedProject'
import { AspectChart } from '../projects/AspectChart'
import Link from 'next/link'
import { truncateText } from '../misc'

export const ProjectHighlight = ({ project, user }: FeaturedProjectResponse) => {
  return (
    <section>
      <h2 className={styles['section-header']} style={{ textAlign: 'center' }}>
        Featured Project: {project.title}
      </h2>
      <Centered>
        <div>
          by <Link href={`/profile/${user.id}`}>{user.displayName}</Link>
        </div>
      </Centered>
      <Row style={{ flexWrap: 'wrap' }}>
        <Column gap="16px" style={{ maxWidth: '400px' }}>
          <p>{truncateText(project.blurb ?? '', 1000)}</p>
        </Column>
        <AspectChart aspects={project.aspects} />
      </Row>
    </section>
  )
}
