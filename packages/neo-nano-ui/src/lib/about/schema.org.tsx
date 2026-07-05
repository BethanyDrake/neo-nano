

const bethanySchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: "Bethany Drake",
  familyName: 'Drake',
  givenName: 'Bethany',
  address: "PO BOX 9103, Traralgon VIC 3844",
  email: "bethany@novel-november.com",
  nationality: "Australia",
  image: "https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/about/bethany-fishpond-500.jpg"
}

export const BethanySchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(bethanySchema).replace(/</g, '\\u003c'),
    }}
  />
)
