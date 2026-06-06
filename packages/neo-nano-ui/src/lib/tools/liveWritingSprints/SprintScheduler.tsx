import { BasicButton } from '@/lib/buttons/BasicButton';
import { createPublicSprint } from '@/lib/serverFunctions/sprints/publicSprint';
import { Sprint } from '@/lib/serverFunctions/sprints/recordPrivateSprint';
import { useMutation } from '@tanstack/react-query';
import { addMinutes } from 'date-fns';



export const SprintScheduler = ({onScheduled}: {onScheduled: (sprint: Sprint) => void}) => {

      const { mutate: scheduleSprint } = useMutation({
        mutationFn: () => {
          return createPublicSprint(addMinutes(Date.now(), 1), 30)
        },
        mutationKey: ['schedule-sprint'],
        onSuccess: (data) => onScheduled(data)
      })
    
    return  ( <BasicButton buttonProps={{ onClick: () => scheduleSprint() }}>Schedule Sprint</BasicButton>)
}