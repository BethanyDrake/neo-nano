import { Project } from './Project.type'
import { LeftRow } from '../layoutElements/flexLayouts'
import novelCover from '@/lib/media/novel-cover.png'
import Grid from '@mui/material/Grid';

import Image from 'next/image'
import { AspectChart } from './AspectChart';
export const PublicProjectSection = ({ project }: { project: Project }) => {
  const { title, blurb, status, excerpt, wordCount} = project
  return (
    <div>
      <LeftRow>
        <h3 style={{fontSize: '2em'}}>{title}</h3>
      </LeftRow>

      <Grid container spacing={3}>
   
      {blurb && (
        <Grid size={{sm: 12, md: 6}}>
          <h4>Blurb:</h4>
          <p style={{ whiteSpaceCollapse: 'preserve' }}>{blurb}</p>
        </Grid>
      )}

   <Grid size={{sm: 12, md: 6}}>
      <Image style={{borderRadius: '4px', boxShadow: "var(--shadow-1)"}} height="300" src={novelCover} alt={title}/>
       <AspectChart aspects={project.aspects}/>
      {wordCount &&<LeftRow>
        <h4>Word count:</h4> <span>{wordCount / 1000}K</span>
      </LeftRow> }
        <LeftRow><h4>Status:</h4> <span>{status}</span></LeftRow>
</Grid>
      {excerpt && (
        <Grid size={{sm: 12, md: 6}}>
          <h4>Excerpt:</h4>
          <p style={{ whiteSpaceCollapse: 'preserve' }}>{excerpt}</p>
        </Grid>
      )}

      {wordCount && (
        <Grid size={6} >
       
        </Grid>
      )}

       </Grid>
    </div>
  )
}
