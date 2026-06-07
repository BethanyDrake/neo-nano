import { BasicButton } from '@/lib/buttons/BasicButton'
import { createPublicSprint } from '@/lib/serverFunctions/sprints/publicSprint'
import { Sprint } from '@/lib/serverFunctions/sprints/recordPrivateSprint'
import { useMutation } from '@tanstack/react-query'
import { addDays, isPast, minutesToSeconds, parse } from 'date-fns'
import { useRef, useState } from 'react'
import formClasses from '@/lib/expandableForms/form.module.css'
import { Centered, Column, LeftRow, Row } from '@/lib/layoutElements/flexLayouts'
import { useForm } from 'react-hook-form'

type Inputs = {
  startTime: string
  duration: string
}

export const SprintScheduler = ({ onScheduled }: { onScheduled: () => void }) => {
  const { register, handleSubmit, reset } = useForm<Inputs>({defaultValues:{duration: '', startTime: ''}})
  const [isOpen, setIsOpen] = useState(false)

  const { mutate: scheduleSprint, isPending } = useMutation({
    mutationFn: ({startTime, duartionSeconds} : {startTime: Date, duartionSeconds: number}) => {
        console.log(startTime)
      return createPublicSprint(startTime, duartionSeconds)
    },
    mutationKey: ['schedule-sprint'],
    onSuccess: () => {
        reset()
        onScheduled()
    },
  })



  

  return (
    <details  open={isOpen} style={{borderRadius: '4px', borderBottom: '2px dashed var(--primary-light)', padding: '16px' }}>
      <summary onClick={() => setIsOpen(!isOpen)} style={{fontSize: 'large', fontWeight: 'bold'}}>Schedule Sprint</summary>
     
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
            <Row alignItems='center' justifyContent='right'>
              <label htmlFor="start-time">Select start time: </label>
              <input style={{width: '100px'}} type="time" {...register('startTime', {required: true})} />
            </Row>
            <Row alignItems='center' justifyContent='right'>
              <label htmlFor="duration">Select duration (mintues): </label>
              <input style={{width: '100px'}}  type="number" placeholder="15" {...register('duration', {required: true})} />
            </Row>
  
          <Centered>
              <BasicButton isLoading={isPending} buttonProps={{ type: 'submit' }}>
            Submit
            </BasicButton>
          </Centered>
         
                    </Column>
          
        </form>
    </details>
  )
}
