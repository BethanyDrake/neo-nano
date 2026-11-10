import Link from 'next/link'
import classNames from './sitemap.module.css'

export const Sitemap = () => {
  return (
    <div>
      <h2>Sitemap</h2>
      <ul className={classNames.Sitemap}>
        <li>
          <Link href="/forum">Forum</Link>
          <p>A place to chat, share your progress, or ask for help from other writers.</p>
        </li>
        <li>
          <Link href="/moderation/code-of-conduct">Code of conduct</Link>
          <p>Know the rules, follow the rules!</p>
        </li>

        <li>
          <Link href="/about">About</Link>
          <p>The team and technology behind novel-november.com</p>
        </li>

        <li>
          <Link href="/faq">FAQ</Link>
          <p>Still have questions? Check here first.</p>
        </li>

        <li>
          <Link href="/tools">Tools</Link>
          <p>Widgets to support your writing journey.</p>
        </li>

        <li>
          <Link href="/analytics">Analytics</Link>
          <p>Challenge outcomes: see how much we wrote and what badges we earned!</p>
        </li>
      </ul>
    </div>
  )
}
