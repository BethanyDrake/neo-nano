import React from 'react'
import { useRanger, Ranger } from '@tanstack/react-ranger'
import { Aspect, Project } from './Project.type'
import { aspectDefinitions } from './aspects'

export const AspectInput = ({
  color,
  value,
  setValue,
  aspect
}: {
  color: string
  value: number
  setValue: (n: number) => void
  aspect: Aspect
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
          key={`${aspect}-slider`}
          id={`${aspect}-slider`}
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
            aria-label={`set ${aspect} to ${_value}`}
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

export const TitledAspectInput = ({
  value,
  setValue,
  aspect,
  descriptions,
  colour,
}: {
  value: number
  setValue: (n: number) => void
  aspect: Aspect
  descriptions: string[]
  colour: string
}) => {
  const description = descriptions[Math.round((value * (descriptions.length - 1)) / 100)]
  const title = aspectDefinitions[aspect].name
  return (
    <div>
      <label htmlFor={`${aspect}-slider`} style={{ textTransform: 'capitalize' }}>{title}:</label> <p>{description}</p>
      <AspectInput aspect={aspect} value={value} setValue={setValue} color={colour}></AspectInput>
    </div>
  )
}

export const AspectInputFormSection = ({
  aspects,
  setAspects,
}: {
  aspects: Project['aspects']
  setAspects: (a: Project['aspects']) => void
}) => {
  return (['fantasy', 'complexity', 'thrill', 'mystery', 'romance'] as const).map((aspect: Aspect) => {
    return (
      <TitledAspectInput
        key={aspect}
        value={aspects[aspect]}
        setValue={(n) => setAspects({ ...aspects, [aspect]: n })}
        aspect={aspect}
        descriptions={aspectDefinitions[aspect].descriptions}
        colour={aspectDefinitions[aspect].colour}
      />
    )
  })
}
