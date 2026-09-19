import { UnderDevelopmentMessage } from '@/lib/UnderDevelopmentMessage'
import { prompts } from './promptList'

export const BrainstormingPrompts = () => {
  return (
    <div>
      <UnderDevelopmentMessage upcomingChanges={[{description:"revise/improve list of prompts"}]}/>
      <h1>Brainstorming Prompts</h1>
      {prompts.map(({ id, Component, category }, index) => (
        <div key={id}>
          <h2>Day {index + 1}</h2>
          <div style={{ fontWeight: 'bold', color: 'var(--text-colour-2)' }}>({category})</div>
          <Component key={id} />
        </div>
      ))}
    </div>
  )
}
