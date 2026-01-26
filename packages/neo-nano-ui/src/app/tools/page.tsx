import { NewAwardModal, NewAwardModalProvider } from '@/lib/awards/NewAwardModal'
import { GutteredPage } from '@/lib/layoutElements/GutteredPage'
import { Timer } from '@/lib/tools/timer'
import classNames  from './tools.module.css'
import { PropsWithChildren } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Centered } from '@/lib/layoutElements/flexLayouts'
import { UnderDevelopmentMessage } from '@/lib/UnderDevelopmentMessage'

const ToolCard = ({toolName, imageSrc, id}: {id: string, toolName: string, imageSrc: string} ) => {
    return (

    <div className={classNames.card}><Link style={{width: '100%'}}href={`/tools/${id}`}><h2>{toolName}</h2> <Image
              alt={toolName}
              width={100}
              height={100}
              src={imageSrc}
            /></Link></div>
    )
}

const ToolsPage = () => {
  return (
    <GutteredPage>
      <UnderDevelopmentMessage upcomingChanges={[]}/>
     <Centered><h1>Toolbox</h1></Centered>
      <div className={classNames.container}>
      <ToolCard  id={"timer"} toolName="Sprint timer" imageSrc="https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/clock.png"/>
      <ToolCard id={"focus-clock"} toolName="Focus clock" imageSrc="https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/clock.png"/>
      </div>
    </GutteredPage>
  )
}

export default ToolsPage