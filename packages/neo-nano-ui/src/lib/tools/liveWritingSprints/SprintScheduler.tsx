import { BasicButton } from '@/lib/buttons/BasicButton'
import { createPublicSprint } from '@/lib/serverFunctions/sprints/publicSprint'
import { useMutation } from '@tanstack/react-query'
import { addDays, isPast, minutesToSeconds, parse } from 'date-fns'
import formClasses from '@/lib/expandableForms/form.module.css'
import { Column, Row } from '@/lib/layoutElements/flexLayouts'
import { useForm } from 'react-hook-form'
import { Disclosure, DisclosureButton, DisclosurePanel, useClose } from '@headlessui/react'
import disclosureStyles from '@/lib/styles/disclosure.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

type Inputs = {
  startTime: string
  duration: string
}

const SchedulerForm = ({ onScheduled }: { onScheduled: () => void }) => {
  const { register, handleSubmit, reset } = useForm<Inputs>({ defaultValues: { duration: '', startTime: '' } })
  const close = useClose()
  const { mutate: scheduleSprint, isPending } = useMutation({
    mutationFn: ({ startTime, durationSeconds }: { startTime: Date; durationSeconds: number }) => {
      console.log(startTime)
      return createPublicSprint(startTime, durationSeconds)
    },
    mutationKey: ['schedule-sprint'],
    onSuccess: () => {
      close()
      reset()
      onScheduled()
    },
  })

  return (
    <form
      className={formClasses.form}
      onSubmit={handleSubmit((data) => {
        let startTime = parse(data.startTime, 'HH:mm', new Date())
        if (isPast(startTime)) {
          startTime = addDays(startTime, 1)
        }
        const durationSeconds = minutesToSeconds(parseInt(data.duration))
        scheduleSprint({ startTime, durationSeconds })
      })}
    >
      <Column>
        <Row alignItems="center" justifyContent="right">
          <label style={{ textAlign: 'right' }} htmlFor="start-time">
            Select start time:
          </label>
          <input style={{ width: '100px' }} type="time" {...register('startTime', { required: true })} />
        </Row>
        <Row alignItems="center" justifyContent="right">
          <label style={{ textAlign: 'right' }} htmlFor="duration">
            Select duration (minutes):
          </label>
          <input
            style={{ width: '100px' }}
            type="number"
            placeholder="15"
            {...register('duration', { required: true })}
          />
        </Row>

        <BasicButton isLoading={isPending} buttonProps={{ type: 'submit' }}>
          Submit
        </BasicButton>
      </Column>
    </form>
  )
}

export const SprintScheduler = ({ onScheduled }: { onScheduled: () => void }) => {
  return (
    <Disclosure>
      <DisclosureButton className={disclosureStyles.DisclosureButton} style={{ fontWeight: 'bold', fontSize: 'large' }}>
        <span>Schedule Sprint</span>
        <FontAwesomeIcon icon={faCaretRight} />
      </DisclosureButton>

      <DisclosurePanel className={disclosureStyles.DisclosurePanel}>
        <SchedulerForm onScheduled={onScheduled} />
      </DisclosurePanel>
    </Disclosure>
  )
}
