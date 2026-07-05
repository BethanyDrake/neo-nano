

const novelNovemberLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Novel November',
  description: 'Write 50,000 words in November',
  duration: 'P30D',
  eventSchedule: {
    '@type': 'Schedule',
    startDate: '2026-11-01',
    endDate: '2026-11-30',
    repeatFrequency: 'P1Y',
  },
}

export const NovemberEventSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(novelNovemberLd).replace(/</g, '\\u003c'),
    }}
  />
)

const midYearNoveletteEventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Mid Year Novelette',
  description: 'Write 15,000 words in July',
  duration: 'P31D',
  eventSchedule: {
    '@type': 'Schedule',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    repeatFrequency: 'P1Y',
  },
}

export const MidYearNoveletteEventSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(midYearNoveletteEventSchema).replace(/</g, '\\u003c'),
    }}
  />
)