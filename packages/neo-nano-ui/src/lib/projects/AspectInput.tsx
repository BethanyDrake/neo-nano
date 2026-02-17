import React from 'react'
import { useRanger, Ranger } from '@tanstack/react-ranger'
import { Project } from './Project.type'

export const AspectInput = ({
  color,
  value,
  setValue,
}: {
  color: string
  value: number
  setValue: (n: number) => void
}) => {
  const rangerRef = React.useRef<HTMLDivElement>(null)

  const rangerInstance = useRanger<HTMLDivElement>({
    getRangerElement: () => rangerRef.current,
    values: [value],
    min: 0,
    max: 100,
    stepSize: 20,
    tickSize: 20,
    onChange: (instance: Ranger<HTMLDivElement>) => setValue(instance.sortedValues[0]),
  })

  return (
    <div
      ref={rangerRef}
      style={{
        position: 'relative',
        userSelect: 'none',
        height: '4px',
        background: color,
        borderRadius: '2px',
      }}
    >
      {rangerInstance.handles().map(({ value, onKeyDownHandler, onMouseDownHandler, onTouchStart }, i) => (
        <button
          key={i}
          onKeyDown={onKeyDownHandler}
          onMouseDown={onMouseDownHandler}
          onTouchStart={onTouchStart}
          role="slider"
          aria-valuemin={rangerInstance.options.min}
          aria-valuemax={rangerInstance.options.max}
          aria-valuenow={value}
          style={{
            position: 'absolute',
            top: '50%',
            left: `${rangerInstance.getPercentageForValue(value)}%`,
            transform: 'translate(-50%, -50%)',
            width: '14px',
            height: '14px',
            outline: 'none',
            borderRadius: '100%',
            background: color,
            border: color,
            zIndex: 50,
          }}
        />
      ))}

      {rangerInstance.getTicks().map(({ value: _value, key }) => {
        return (
          <button
            role="button"
            key={key}
            onClick={(event) => {
              event.preventDefault()
              setValue(_value)
            }}
            style={{
              position: 'absolute',

              top: '50%',
              left: `${rangerInstance.getPercentageForValue(_value)}%`,
              transform: 'translate(-50%, -50%)',
              width: '14px',
              height: '14px',
              outline: 'none',
              borderRadius: '100%',
              background: _value < value ? color : 'white',
              zIndex: 20,
              border: `1px solid ${color}`,
            }}
          ></button>
        )
      })}
    </div>
  )
}

export const FantasyAspectInput =  ({value, setValue}: {value: number, setValue: (n: number) => void}) => {

  const descriptions = [
    'factual',
    'based on true events',
    'real world setting',
    'real world with fantasy/speculative elements',
    'fantasy world',
  ]

  const description = descriptions[Math.round((value * (descriptions.length - 1)) / 100)]
  return (
    <div>
      <h4>Fantasy: </h4> <p>{description}</p>
      <AspectInput value={value} setValue={setValue} color="var(--primary-vibrant)"></AspectInput>
    </div>
  )
}

export const ComplexityAspectInput = ({value, setValue}: {value: number, setValue: (n: number) => void}) => {


  const descriptions = ['clear and direct', 'some complexity', 'deeply complex']

  const description = descriptions[Math.round((value * (descriptions.length - 1)) / 100)]
  return (
    <div>
      <h4>Complexity: </h4> <p>{description}</p>
      <AspectInput value={value} setValue={setValue} color="var(--secondary-vibrant)"></AspectInput>
    </div>
  )
}

export const RomanceAspectInput = ({value, setValue}: {value: number, setValue: (n: number) => void}) => {


  const descriptions = ['no romance', 'some romance', 'romantic subplot', 'romance main plot']

  const n = Math.round(value / descriptions.length)
  const description = descriptions[Math.round((value * (descriptions.length - 1)) / 100)]
  console.log({ description, n })
  return (
    <div>
      <h4>Romance: </h4> <p>{description}</p>
      <AspectInput value={value} setValue={setValue} color="var(--secondary-light)"></AspectInput>
    </div>
  )
}

export const ThrillAspectInput =  ({value, setValue}: {value: number, setValue: (n: number) => void}) => {

  const descriptions = ['cozy', 'thrilling']

  const description = descriptions[Math.round((value * (descriptions.length - 1)) / 100)]

  return (
    <div>
      <h4>Thrill: </h4> <p>{description}</p>
      <AspectInput value={value} setValue={setValue} color="var(--tertiary-vibrant)"></AspectInput>
    </div>
  )
}

export const MysteryAspectInput = ({value, setValue}: {value: number, setValue: (n: number) => void}) => {

  const descriptions = ['no mystery', 'some mystery', 'mystery subplot', 'mystery main plot']

  const description = descriptions[Math.round((value * (descriptions.length - 1)) / 100)]

  return (
    <div>
      <h4>Mystery: </h4> <p>{description}</p>
      <AspectInput value={value} setValue={setValue} color="var(--primary-light)"></AspectInput>
    </div>
  )
}

export const AspectInputFormSection = ({ aspects, setAspects }: {aspects: Project['aspects'], setAspects: (a: Project['aspects']) => void}) => {
  
  return (
    <>
      <FantasyAspectInput value={aspects.fantasy} setValue={(n) => setAspects({...aspects, fantasy: n})}/>
      <ComplexityAspectInput value={aspects.complexity} setValue={(n) => setAspects({...aspects, complexity: n})}/>
      <ThrillAspectInput value={aspects.thrill} setValue={(n) => setAspects({...aspects, thrill: n})}/>
      <MysteryAspectInput value={aspects.mystery} setValue={(n) => setAspects({...aspects, mystery: n})}/>
      <RomanceAspectInput value={aspects.romance} setValue={(n) => setAspects({...aspects, romance: n})}/>
    </>
  )
}
