import { Column, Row } from '@/lib/layout'
import styles from './index.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Category } from '@/lib/forum.types'
import { NextPageContext } from 'next'


const ForumItem = ({topicId, title, icon, description}: {topicId: string, title: string, icon: IconProp, description: string}) => {
return( <div className={styles['forum-item']}>
                    <Row justifyContent="left">
                        
                        <Column>
                            <div className={styles["forum-icon"]}>
                                <FontAwesomeIcon icon={icon} />
                         </div>
                         </Column>
                         <Column>
                            <a href={`forum/${topicId}`} className={styles["forum-item-title"]}>{title}</a>
                            <div className={styles["forum-sub-title"]}>{description}</div>
                        </Column>
                       
                </Row></div>)
}


type ForumProps = {
 categories: Category[]
}
export const Forum = ({categories}: ForumProps) => {

    console.log("Forum prop", categories)

    return (
    <main>
        <div className={styles['forum-container']}>
{
    categories.map(({id, title, topics }) => {
        return (    <div key={id}><h2>{title}</h2>
            {topics.map(({id, title, description, icon})=> {
            return <ForumItem key={id} topicId={id} title={title} description={description} icon={Icons[icon]} />
        })}</div>)
    })
}
    
</div></main>)
}

Forum.getInitialProps = async (ctx: NextPageContext) => {
  const res = await fetch(`${process.env.APP_BASE_URL}/api/getTopics`)
  const {categories} = await res.json()
  return { categories }
}
 
export default Forum

