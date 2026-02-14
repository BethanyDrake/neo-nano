import { Project } from './Project.type'
import { LeftRow } from '../layoutElements/flexLayouts'

export const PublicProjectSection = ({ project }: { project: Project }) => {
  const { title, blurb, status, excerpt, wordCount} = project
  return (
    <>
      <LeftRow>
        <h3 style={{fontSize: '1.5em'}}>{title}</h3>
        <span style={{ color: 'var(--text-colour-2)', fontSize: '1.5em' }}>({status})</span>
      </LeftRow>

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

      {wordCount && (
        <LeftRow>
          <h4>Expected/Final word count:</h4> <span>{wordCount / 1000}K</span>
        </LeftRow>
      )}
    </>
  )
}
