import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Project } from './Project.type'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faTrash } from '@fortawesome/free-solid-svg-icons'
import disclosureStyles from '@/lib/styles/disclosure.module.css'
import { Column, LeftRow, Row } from '../layoutElements/flexLayouts'
import { SmallIconButton } from '../buttons/ExtendableIconButton'
import { useMyProjectsContext } from './MyProjectContext'
import { EditProjectModal } from '../modals/EditProjectModal'
import { AspectChart } from './AspectChart'

export const ProjectSection = ({ project }: {project: Project}) => {
  const {title, blurb, status, excerpt, wordCount , id, visibility} = project
  const {deleteProject, isDeleteProjectPending} = useMyProjectsContext()
  return (
    <Disclosure>
      <DisclosureButton className={disclosureStyles.DisclosureButton}>
        <FontAwesomeIcon icon={faCaretRight} /> <h3>{title}</h3>{' '}
        <span style={{ color: 'var(--text-colour-2)', fontSize: '1.5em' }}>({status})</span>
      </DisclosureButton>
      <DisclosurePanel className={disclosureStyles.DisclosurePanel}>
        <Row style={{ paddingTop: '1em' }} justifyContent="right" alignItems="center">
          <h4>Edit / Remove:</h4>
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

        
<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'start', justifyContent: 'left', gap: '32px' }}>
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
              <LeftRow>
              <h4>Visibility:</h4> <span>{visibility}</span>
            </LeftRow>
          </>
        )}
      </Column>
    </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
