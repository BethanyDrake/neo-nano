import { NewAwardModal, NewAwardModalProvider } from '@/lib/awards/NewAwardModal'
import { Centered } from '@/lib/layoutElements/flexLayouts'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { UnderDevelopmentMessage } from '@/lib/UnderDevelopmentMessage'
import Image from 'next/image'
import Link from 'next/link'
import classNames from './tools.module.css'
import focusClock from '@/lib/tools/images/focus-clock.png'
import sprintTimer from '@/lib/tools/images/sprint-timer.png'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'

const ToolCard = ({toolName, imageSrc, id, description}: {id: string, toolName: string, imageSrc: string | StaticImport, description: string} ) => {
    return (

    <div className={classNames.card}><Link style={{width: '100%'}}href={`/tools/${id}`}><h2>{toolName}</h2> <Image
              alt={toolName}
              width={100}
              height={100}
              src={imageSrc}
            /><div className={classNames.description}>{description}</div></Link></div>
    )
}

const ToolsPage = () => {
  return (
    <NewAwardModalProvider >
    <GutteredPage>
      <UnderDevelopmentMessage upcomingChanges={['enter word count after a sprint', 'graph wpm over a sprint session']}/>
     <Centered><h1>Toolbox</h1></Centered>
      <div className={classNames.container}>
      <ToolCard  description={"Set a timer, then see how many words you can write!"}id={"timer"} toolName="Sprint timer" imageSrc={sprintTimer}/>
      <ToolCard description={'Just start editing, and log the time after.'} id={"focus-clock"} toolName="Focus clock" imageSrc={focusClock}/>
      </div>
    </GutteredPage>
    <NewAwardModal/>
    </NewAwardModalProvider>
  )
}

export default ToolsPage