import { Column } from "../layoutElements/flexLayouts"
import { TeamMember } from "./SectionItems"

export const TeamMembers = () => {
    return   <Column>
        <TeamMember
          fullName={'Bethany Drake'}
          role={'Lead Developer'}
          description={
            'Bethany is an Australian programmer specialising in web development. She primarily writes fantasy novels, with occasional daliances into sci-fi and historical fiction.'
          }
          picture={'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/about/bethany-fishpond-500.jpg'}
        />
        <TeamMember
          fullName={'You?'}
          role={'Graphic designer'}
          description={
            <>
              Although she does her best, Bethany is not an artist, graphic designer, or ui designer. If you see
              something ugly that you know how to fix, please contact <i>bethany@novel-november.com</i> with a short
              description of your experience and availability.
            </>
          }
          picture={'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/about/unknown.svg'}
        />

        <TeamMember
          fullName={'Rahma • You?'}
          role={'Testers'}
          description={
            <>
              {
                "Before changes are released to the site, they are deployed to a 'preview' environment. This preview site can be used like a sandbox to play around with the new feature and find any bugs. For instructions on how to get access to the preview site, please contact "
              }{' '}
              <i>bethany@novel-november.com</i>
            </>
          }
          picture={'https://ytw3r4gan2ohteli.public.blob.vercel-storage.com/about/unknown.svg'}
        />
      </Column>
}