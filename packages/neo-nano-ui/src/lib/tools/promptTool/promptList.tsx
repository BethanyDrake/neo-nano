import Link from "next/link"
import { JSX } from "react"

type Prompt =  {
    id: string,
    Component: () => JSX.Element
    category : 'theme'|'character' | 'plot'| 'setting'
}
export const prompts: Prompt[] = [
    {
        id: 'society-problems',
        category: 'theme',
        Component: () => <p>List 3 problems in society. How might they be fixed? What new problems might arise from fixing them?</p>
    },
    {
        id: 'physical-appearance',
        category: 'character',
        Component: () => <p>Describe the physical appearance of 3 characters. Make them as distinct and interesting as possible.</p>
    },
    {
        id: 'travel-guide',
        category: 'setting',
        Component: () => <p>{"Pick a country you've never been to. Research the climate, culture, architecture, and natural features. Write a 300 word travel guide."}</p>
    },
    {
        id: 'tv-tropes',
        category: 'plot',
        Component: () => <p>Browse <Link href="https://tvtropes.org/pmwiki/pmwiki.php/Main/Tropes">TV Tropes</Link>. Find 3 tropes that interest you, then outline a story that encompasses them all.</p>
        
    },
    {
        id: 'never-learn',
        category: 'theme',
        Component: () => <p>List 3 things that everyone should learn as they become an adult. Then write a character who learned none of them.</p>
    },
    {
        id: '7-traits',
        category: 'character',
        Component: () => <p>Write 7 positive and 7 negative character traits. Then choose one of each to create 7 unique characters.</p>
    },

      {
        id: 'tarot-cards',
        category: 'plot',
        Component: () => <p>Select 3 cards from a <Link href="https://randomtarotcard.com/">tarot deck</Link>: past, present, and future. Outline a story based on the cards.</p>
    },
    {
        id: '10-professions',
        category: 'character',
        Component: () => <p>List 10 professions. Pick 2 and make them into characters, then write a scene with them.</p>
    },
    {
        id: 'synopsis',
        category: 'plot',
        Component: () => <p>Write a 300 word synopsis of a book you know well. Rewrite the synopsis with the same structure, changing the details.</p>
    },
    {
        id: 'people-watching',
        category: 'character',
        Component: () => <p>Go to a public place and observe 3 people. Write a short description of each, including their appearance, expression, and behaviour.</p>
    },
    {
        id: 'resent',
        category: 'plot',
        Component: () => <p>List 5 situations a character might resent. How might they lash out? What reasons do they have to stay? </p>
    },
    {
        id: 'friendship',
        category: 'theme',
        Component: () => <p>Write 3 things you believe about friendship. How might your story represent or challenge those beliefs? </p>
    },
    {
        id: '3-animals',
        category: 'character',
        Component: () => <p>Pick 3 animals. Create a character based on each one. </p>
    },
    {
        id: '3-perspectives',
        category: 'character',
        Component: () => <p>Describe your protagonist from 3 perspectives: a stranger, a close friend, and someone who hates their guts. </p>
    },

    {
        id: '3-locations',
        category: 'setting',
        Component: () => <p>Describe 3 locations that might be in your story. Make them as distinct and interesting as possible. </p>
    },
     {
        id: '5-tropes',
        category: 'plot',
        Component: () => <p>List 5 common tropes in your genre. How might you subvert these tropes? </p>
    },
    {
        id: 'nature-of-evil',
        category: 'theme',
        Component: () => <p>Write 3 things about the nature of evil. Then write about a good person who disagrees.  </p>
    },
     {
        id: '3-strength-weaknesses',
        category: 'character',
        Component: () => <p>Describe 3 strengths and 3 weaknesses of a character. How might you show off their strengths? How might their weaknesses cause problems? </p>
    },
    {
        id: 'action-scene',
        category: 'setting',
        Component: () => <p>Describe a room where an action scene might take place. Consider what tools and obstacles might be available. </p>
    },
    {
        id: 'love',
        category: 'theme',
        Component: () => <p>Write 3 things you believe about love. Write a paragraph from the perspective of a character that disagrees on every point.</p>
    },
    {
        id: 'handicaps',
        category: 'character',
        Component: () => <p>List 3 <Link href="https://www.youtube.com/watch?v=7MulV-vmg4I&t=78s">handicaps</Link> and how they might be exploited.</p>
    },
    {
        id: 'loss',
        category: 'theme',
        Component: () => <p>List 3 things that cause loss or grief. Write characters that have experienced each, and then write a group therapy scene. </p>
    },
    {
        id: 'family-tree',
        category: 'character',
        Component: () => <p>{"Draw a family tree for 3 different characters. Consider how the relationships (or lack thereof) affected each character's upbringing."}</p>
    },
     {
        id: 'climate',
        category: 'setting',
        Component: () => <p>What is the climate like in your setting? Describe the different seasons. What do people wear to cope with the weather? </p>
    },
    {
        id: 'animals',
        category: 'setting',
        Component: () => <p>{"Describe the animals of your setting. How might they interact with your characters, or cause problems?"}</p>
    },
    {
        id: 'authority',
        category: 'setting',
        Component: () => <p>Who are the authority figures in your story? How do they enforce their will, and how might they cause problems for your protagonist?</p>
    },
    {
        id: 'antagonist-goal',
        category: 'plot',
        Component: () => <p>{"What is your antagonist's goal? Write 3 steps they might take to reach it, and 3 ways your protagonist might stand in the way."}</p>
    },

    {
        id: 'protagonist-goal',
        category: 'plot',
        Component: () => <p>{"What is your protagonist's goal? Describe 3 steps they might take to reach it, and 3 things that might stand in their way. "}</p>
    },
     {
        id: 'awkward-date',
        category: 'character',
        Component: () => <p>{"Pick two characters who are not romantically involved and send them on a date. "}</p>
    },
    {
        id: 'overall-theme',
        category: 'theme',
        Component: () => <p>{"What is the theme of your story? Write the theme as a single sentence, then write a paragraph outlining how the theme will be explored."}</p>
    },
    {
        id: 'outline',
        category: 'plot',
        Component: () => <p>{"Build an outline: list the events that will happen in your story."}</p>
    },
]
