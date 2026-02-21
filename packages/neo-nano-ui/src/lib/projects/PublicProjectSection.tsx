import { Project } from './Project.type'
import { AspectChart } from './AspectChart'
import { Column, LeftRow } from '../layoutElements/flexLayouts'

export const PublicProjectSection = ({ project }: { project: Project }) => {
  const { title, blurb, status, excerpt, wordCount } = project
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', justifyContent: 'center', gap: '32px' }}>
      <div style={{ maxWidth: '500px' }}>
        <Column>
          <h3 style={{ fontSize: '2em' }}>{title}</h3>
          {blurb && (
            <>
              <h4>Blurb:</h4>
              <p style={{ whiteSpaceCollapse: 'preserve' }}>{blurb}</p>
            </>
          )}
          {excerpt && (
            <>
              <h4>Excerpt:</h4>
              <p style={{ whiteSpaceCollapse: 'preserve' }}>{excerpt}</p>
            </>
          )}
        </Column>
      </div>
      <Column>
        <AspectChart aspects={project.aspects} />
        {wordCount && (
          <>
            <LeftRow>
              <h4>Word count:</h4> <span>{wordCount / 1000}K</span>
            </LeftRow>
            <LeftRow>
              <h4>Status:</h4> <span>{status}</span>
            </LeftRow>
          </>
        )}
      </Column>
    </div>
  )
}
