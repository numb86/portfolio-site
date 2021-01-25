import Link from 'next/link';

import styles from './header.module.css';

export function Header() {
  const LINK_LIST = [
    {link: '/', text: 'Top'},
    {link: '/github', text: 'GitHub Activity'},
    {link: '/blog', text: 'Blog'},
  ];

  const Item: React.FC<{
    link: string;
    text: string;
  }> = ({link, text}) => (
    <Link href={link}>
      <a>
        <div className={styles.header_item}>{text}</div>
      </a>
    </Link>
  );

  return (
    <header className={styles.header}>
      {LINK_LIST.map(({link, text}) => (
        <Item key={text} link={link} text={text} />
      ))}
    </header>
  );
}
