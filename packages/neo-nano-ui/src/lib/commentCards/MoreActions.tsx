import { faEdit, faEllipsis, faFlag, faReply, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './MoreActions.module.css'
import iconButtonClasses from '@/lib/buttons/ExtendableIconButton.module.css'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { CommentAction, useCommentActionContext, useCommentCardContext } from './CommentCard'
import { UserContext } from '../context/UserContext'
import { useContext } from 'react'
import { useThreadContext } from '../context/ThreadContext'

const ActionItem = ({ text, icon, action }: { text: string; icon: IconProp; action: CommentAction }) => {
  const { setActiveAction } = useCommentActionContext()

  return (
    <MenuItem>
      <button
        onClick={() => {
          setActiveAction(action)
        }}
        className={classes['menu-item']}
      >
        <span>{text}</span>
        <FontAwesomeIcon icon={icon} />
      </button>
    </MenuItem>
  )
}

export const MoreActions = () => {
  const me = useContext(UserContext)
  const { isLocked } = useThreadContext()
  const {
    author,
    comment: { isDeleted },
  } = useCommentCardContext()
  const isMyComment = me?.id === author.id
  const canReply = !isDeleted && !isLocked
  const canEdit = !isDeleted && isMyComment && !isLocked
  const canReport = !isMyComment
  const canDelete = !isDeleted && isMyComment
  if (!canReply && !canEdit && !canReport && !canDelete) return null
  return (
    <Menu>
      <MenuButton
        aria-label="more actions"
        className={`${iconButtonClasses['small-icon-button']} ${classes['more-actions-button']} `}
        role={'button'}
      >
        <FontAwesomeIcon icon={faEllipsis} />
      </MenuButton>
      <MenuItems anchor={'bottom end'} className={classes['menu-items']}>
        {canReply && <ActionItem text="reply" icon={faReply} action="reply" />}
        {canEdit && <ActionItem text="edit" icon={faEdit} action="edit" />}
        {canReport && <ActionItem text="report" icon={faFlag} action="report" />}
        {canDelete && <ActionItem text="delete" icon={faTrashCan} action="delete" />}
      </MenuItems>
    </Menu>
  )
}
