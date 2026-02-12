import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Project } from './Project.type'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight, faTrash } from '@fortawesome/free-solid-svg-icons'
import classNames from '@/lib/styles/disclosure.module.css'
import { Row } from '../layoutElements/flexLayouts'
import { UpdateVisibilityButton } from '../buttons/UpdateVisibilityBotton'
import { SmallIconButton } from '../buttons/ExtendableIconButton'

export const ProjectSection = ({ title, blurb, visibility, status }: Project) => {
  return (
    <Disclosure>
      <DisclosureButton className={classNames.DisclosureButton}>
        <FontAwesomeIcon icon={faCaretRight} /> <h3>{title}</h3>{' '}
        <span style={{ color: 'var(--text-colour-2)', fontSize: '1.5em' }}>({status})</span>
      </DisclosureButton>
      <DisclosurePanel className={classNames.DisclosurePanel}>
        <Row style={{ paddingTop: '1em' }} justifyContent="space-between" alignItems="center">
          <h4>Quick Actions:</h4>
          <Row alignItems="center">
            <UpdateVisibilityButton
              onClick={() => {
                window.alert('todo')
                return Promise.reject()
              }}
              visibility={visibility}
            />
            <SmallIconButton
              id="delete"
              onClick={() => window.alert('todo')}
              isLoading={false}
              icon={faTrash}
              text="delete project"
              variant="angry"
            />
          </Row>
        </Row>
        {blurb}
      </DisclosurePanel>
    </Disclosure>
  )
}
