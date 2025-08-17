import { Column, Row } from '@/lib/layout'
import styles from './forum.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoltLightning, faShield } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'


const ForumItem = ({title, icon, description}: {title: string, icon: IconProp, description: string}) => {
return( <div className={styles['forum-item']}>
                    <Row justifyContent="left">
                        
                        <Column>
                            <div className={styles["forum-icon"]}>
                                <FontAwesomeIcon icon={icon} />
                         </div>
                         </Column>
                         <Column>
                            <a href="forum_post.html" className={styles["forum-item-title"]}>{title}</a>
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
    <ForumItem title="General Discussion" description={"Talk about sports, entertainment, music, movies, your favorite color, talk about enything."} icon={faShield}/>
       <ForumItem title="Introductions" description={"New to the community? Please stop by, say hi and tell us a bit about yourself."} icon={faBoltLightning}/>
    
    <h2>Craft of Writing</h2>
        <ForumItem title="General Discussion" description={"Talk about sports, entertainment, music, movies, your favorite color, talk about enything."} icon={faShield}/>
       <ForumItem title="Introductions" description={"New to the community? Please stop by, say hi and tell us a bit about yourself."} icon={faBoltLightning}/>
    
</div></main>)

}

export default Forum