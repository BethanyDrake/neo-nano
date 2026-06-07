import { BasicButton } from '@/lib/buttons/BasicButton'
import { createPublicSprint } from '@/lib/serverFunctions/sprints/publicSprint'
import { Sprint } from '@/lib/serverFunctions/sprints/recordPrivateSprint'
import { useMutation } from '@tanstack/react-query'
import { addDays, isPast, minutesToSeconds, parse } from 'date-fns'
import { useState } from 'react'
import formClasses from '@/lib/expandableForms/form.module.css'
import { Column, LeftRow } from '@/lib/layoutElements/flexLayouts'
import { useForm } from 'react-hook-form'

type Inputs = {
  startTime: string
  duration: string
}

export const SprintScheduler = ({ onScheduled }: { onScheduled: (sprint: Sprint) => void }) => {
  const { register, handleSubmit } = useForm<Inputs>({defaultValues:{duration: '', startTime: ''}})
  const { mutate: scheduleSprint, isPending } = useMutation({
    mutationFn: ({startTime, duartionSeconds} : {startTime: Date, duartionSeconds: number}) => {
        console.log(startTime)
      return createPublicSprint(startTime, duartionSeconds)
    },
    mutationKey: ['schedule-sprint'],
    onSuccess: (data) => onScheduled(data),
  })

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <BasicButton buttonProps={{ onClick: () => setIsOpen(true) }}>Schedule Sprint</BasicButton>
      {isOpen && (
        <form className={formClasses.form} onSubmit={handleSubmit((data) => {
            console.log("data.startTime", data.startTime)
            let startTime = parse(data.startTime, 'HH:mm', new Date())
            if (isPast(startTime)) {
                startTime = addDays(startTime, 1)
            }
            const duartionSeconds = minutesToSeconds(parseInt(data.duration))
            scheduleSprint({startTime, duartionSeconds})
        })}>
          <Column>
            <LeftRow>
              {' '}
              <label htmlFor="start-time">Select start time: </label>
              <input type="time" {...register('startTime')} />
            </LeftRow>
            <LeftRow>
              <label htmlFor="duration">Select duration (mintues): </label>
              <input type="number" placeholder="15" {...register('duration')} />
            </LeftRow>{' '}
          </Column>
          <BasicButton isLoading={isPending} buttonProps={{ type: 'submit' }}>
            Submit
          </BasicButton>
        </form>
      )}
    </>
  )
}
