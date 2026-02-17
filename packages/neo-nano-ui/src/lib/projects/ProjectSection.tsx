import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Project } from './Project.type'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faTrash } from '@fortawesome/free-solid-svg-icons'
import disclosureStyles from '@/lib/styles/disclosure.module.css'
import { LeftRow, Row } from '../layoutElements/flexLayouts'
import { SmallIconButton } from '../buttons/ExtendableIconButton'
import { useMyProjectsContext } from './MyProjectContext'
import { EditProjectModal } from '../modals/EditProjectModal'
import { AspectChart } from './AspectChart'

export const ProjectSection = ({ project }: {project: Project}) => {
  const {title, blurb, status, excerpt, wordCount , id} = project
  const {deleteProject, isDeleteProjectPending} = useMyProjectsContext()
  return (
    <Disclosure>
      <DisclosureButton className={disclosureStyles.DisclosureButton}>
        <FontAwesomeIcon icon={faCaretRight} /> <h3>{title}</h3>{' '}
        <span style={{ color: 'var(--text-colour-2)', fontSize: '1.5em' }}>({status})</span>
      </DisclosureButton>
      <DisclosurePanel className={disclosureStyles.DisclosurePanel}>
        <Row style={{ paddingTop: '1em' }} justifyContent="space-between" alignItems="center">
          <h4>Quick Actions:</h4>
          <Row alignItems="center">
            <EditProjectModal initialProject={project}/>
            <SmallIconButton
              id="delete"
              onClick={() => deleteProject(id)}
              isLoading={isDeleteProjectPending}
              icon={faTrash}
              text="delete project"
              variant="angry"
            />
          </Row>
        </Row>

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

        <AspectChart aspects={project.aspects}/>

        {wordCount && (
          <LeftRow>
            <h4>Expected/Final word count:</h4> <span>{ wordCount / 1000}K</span>
          </LeftRow>
        )}
      </DisclosurePanel>
    </Disclosure>
  )
}
