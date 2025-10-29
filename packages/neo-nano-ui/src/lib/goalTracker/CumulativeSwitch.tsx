import { Switch } from "@headlessui/react"
import classNames from './goalTracker.module.css'

export const CumulativeSwitch = ({isCumulative, setIsCumulative}: {isCumulative: boolean, setIsCumulative: (value: boolean) => void}) => {
    return ( <Switch checked={isCumulative} className={classNames.switchContainer} onChange={setIsCumulative}>
          <span className={isCumulative ? classNames.inactiveMode : classNames.activeMode}>Words Per Day</span>
          <span> • </span>
          <span className={isCumulative ? classNames.activeMode : classNames.inactiveMode}>Cumulative</span>
        </Switch>)
}