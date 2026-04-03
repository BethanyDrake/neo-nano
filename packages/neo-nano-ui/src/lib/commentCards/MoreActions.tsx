import { faEllipsis, faFlag, faReply } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './MoreActions.module.css'
import iconButtonClasses from '@/lib/buttons/ExtendableIconButton.module.css'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { CommentAction, useCommentActionContext } from './CommentCard'

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
        <ActionItem text="reply" icon={faReply} action="reply" />
        {/* <ActionItem text="edit" icon={faEdit}/> */}
        <ActionItem text="report" icon={faFlag} action="report" />
      </MenuItems>
    </Menu>
  )
}
