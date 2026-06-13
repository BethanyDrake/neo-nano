import classes from './liveSprints.module.css'
import inProgressLogo from './in-progress-logo.png'
import Image from 'next/image'

export const FloatingSprintButton = ({onClick}: {onClick: ()=> void}) => {
     return <button role="button" onClick={onClick} className={classes.FloatingSprintButton}><Image width={100} height={100} src={inProgressLogo} alt="Open in-progress sprint"/></button>
}