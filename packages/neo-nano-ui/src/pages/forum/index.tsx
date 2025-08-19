import { Column, Row } from '@/lib/layout'
import styles from './index.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoltLightning, faPerson, faShield } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faPenFancy } from '@fortawesome/free-solid-svg-icons/faPenFancy'


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

export const Forum = () => {



return (
    <main>

        <h1>Forum</h1>
<div className={styles['forum-container']}>
    <h2>General</h2>
    <ForumItem topicId='generalDiscussion' title="General Discussion" description={"For anything without a dedicated topic... or when your brain is too fried to find the right place."} icon={faShield}/>
       <ForumItem topicId='introductions' title="Introductions" description={"Introduce yourself, your project, and your cat (optional)."} icon={faBoltLightning}/>
    
    <h2>Craft of Writing</h2>
        <ForumItem topicId='appelationStation' title="Appelation Station" description={"Character names, novel titles, and all other proper nouns."} icon={faPerson}/>
       <ForumItem topicId='planning' title="Planning" description={"World building, character sheets, save-the-cat, all planning progress and problems go here."} icon={faPenFancy}/>

    
</div></main>)

}

export default Forum