import { faCirclePause } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from './timer.module.css'
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons"
import { useTimerResultType } from "react-timer-hook/dist/types/src/useTimer"
export const PausePlayToggle = ({pause, resume, isRunning}: Pick<useTimerResultType, 'pause' | 'resume' | 'isRunning'>) => {
    
    
    if (isRunning) {
        return  <button title="pause" onClick={pause} className={classNames.PausePlayToggle}><FontAwesomeIcon size="xl" icon={faCirclePause} /></button>
    }
    return  <button title="resume" onClick={resume} className={classNames.PausePlayToggle}><FontAwesomeIcon size="xl" icon={faCirclePlay} /></button>
  
}