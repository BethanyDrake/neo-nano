import { Aspect } from "./Project.type"

type AspectDefinition = {
  name: string
  descriptions: string[]
  colour: string
}

export const aspectDefinitions: Record<Aspect, AspectDefinition> = {
  mystery: {
    name: 'mystery',
    descriptions: ['no mystery', 'some mystery', 'mystery subplot', 'mystery main plot'],
    colour: 'var(--primary-light)',
  },
  thrill: 
  {
    name: 'thrill',
    descriptions: ['cozy', 'thrilling'],
    colour: 'var(--tertiary-vibrant)',
  },
  romance:
  {
    name: 'romance',
    descriptions: ['no romance', 'some romance', 'romantic subplot', 'romance main plot'],
    colour: 'var(--secondary-light)',
  },
  complexity:
  {
    name: 'complexity',
    descriptions: ['clear and direct', 'some complexity', 'deeply complex'],
    colour: 'var(--secondary-vibrant)',
  },
  fantasy:
  {
    name: 'fantasy',
    descriptions: [
      'factual',
      'based on true events',
      'real world setting',
      'real world with fantasy/speculative elements',
      'fantasy world',
    ],
    colour: 'var(--primary-vibrant)',
  },
}
