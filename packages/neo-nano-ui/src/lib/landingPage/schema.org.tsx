const location = {
  '@type': 'VirtualLocation',
  url: 'https://www.novel-november.com/',
}

const organizer = {
  '@type': 'Organization',
  name: 'Neo Nano',
  url: 'https://www.novel-november.com/',
  address: "PO BOX 9103, Traralgon VIC 3844",
  email: "bethany@novel-november.com"
}

const novelNovemberLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Novel November',
  description: 'Write 50,000 words in November',
  duration: 'P30D',
  startDate: '2026-11-01',
  location,
  organizer,
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
  startDate: '2026-11-01',
  location,
  organizer,
}

export const MidYearNoveletteEventSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(midYearNoveletteEventSchema).replace(/</g, '\\u003c'),
    }}
  />
)
