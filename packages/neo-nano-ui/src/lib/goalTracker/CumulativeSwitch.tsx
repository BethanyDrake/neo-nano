import { Switch } from '@headlessui/react'
import classNames from './goalTracker.module.css'
import { useEffect } from 'react'

export const CumulativeSwitch = ({
  isCumulative,
  setIsCumulative,
}: {
  isCumulative: boolean
  setIsCumulative: (value: boolean) => void
}) => {
  useEffect(() => {
    const storedIsCumulative = window.localStorage.getItem('isCumulative')
    setIsCumulative(storedIsCumulative === 'true')
  }, [setIsCumulative])

  const onChange = (newValue: boolean) => {
    window.localStorage.setItem('isCumulative', `${newValue}`)
    setIsCumulative(newValue)
  }

  return (
    <Switch checked={isCumulative} className={classNames.switchContainer} onChange={onChange}>
      <span className={isCumulative ? classNames.inactiveMode : classNames.activeMode}>Words Per Day</span>
      <span> • </span>
      <span className={isCumulative ? classNames.activeMode : classNames.inactiveMode}>Cumulative</span>
    </Switch>
  )
}
