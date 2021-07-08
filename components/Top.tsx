import Link from 'next/link';

import {Layout} from '../shared/components/Layout';
import {BlogEntryComponent} from '../components/Blog/BlogEntry';

import styles from '../styles/utils.module.css';
import topStyles from './top.module.css';

import type {BlogEntry} from '../components/Blog/BlogEntry';

function ServicesInUse() {
  return (
    <ul className={topStyles.services_in_use}>
      <a href="https://github.com/numb86" target="_blank" rel="noreferrer">
        <li>
          <img
            src="/images/github-logo.png"
            alt="GitHub"
            className={topStyles.github_logo}
          />
        </li>
      </a>
      <a
        href="https://numb86-tech.hatenablog.com/"
        target="_blank"
        rel="noreferrer"
      >
        <li>
          <img
            src="/images/hatena-blog-logo.png"
            alt="Hatena Blog"
            className={topStyles.hatena_blog_logo}
          />
        </li>
      </a>
      <a href="https://twitter.com/numb_86" target="_blank" rel="noreferrer">
        <li>
          <img
            src="/images/twitter-logo.png"
            alt="Twitter"
            className={topStyles.twitter_logo}
          />
        </li>
      </a>
    </ul>
  );
}

const PRODUCT_LIST = [
  {
    name: 'Power Assert Deno 🦕',
    link: 'https://github.com/numb86/power-assert-deno',
    description: 'Deno で Power Assert を利用するためのモジュール',
    technologyUsed: 'Deno, AST',
  },
  {
    name: "numb86's portfolio 💻",
    link: 'https://github.com/numb86/portfolio-site',
    description: 'Concurrent Mode や SWR を使ったポートフォリオサイト',
    technologyUsed: 'Next.js, TypeScript, Vercel',
  },
  {
    name: 'Shape Painter 🎨',
    link: 'https://shape-painter.numb86.net/tree',
    description: 'ツリー図を簡単に作るためのウェブアプリ',
    technologyUsed: 'React, Redux, TypeScript, AWS',
  },
  {
    name: 'use KVS as cache architecture',
    link: 'https://github.com/numb86/use-kvs-as-cache-architecture',
    description:
      'Edge で動くキーバリューストアを使って動的コンテンツをキャッシュする実験',
    technologyUsed: 'Cloudflare Workers KV, Deno',
  },
];

function Products() {
  const Product: React.FC<{
    name: string;
    link: string;
    description: string;
    technologyUsed: string;
  }> = ({name, link, description, technologyUsed}) => (
    <div className={styles.card}>
      <div className={styles.card_inner}>
        <a href={link} target="_blank" rel="noreferrer">
          <h3>{name}</h3>
          <p>{description}</p>
          <p>
            <b>使用技術：</b>
            {technologyUsed}
          </p>
        </a>
      </div>
    </div>
  );

  return (
    <>
      <h2 className={topStyles.headline}>Products</h2>
      <div className={styles.grid}>
        {PRODUCT_LIST.map((item) => (
          <Product key={item.name} {...item} />
        ))}
      </div>
      <Link href="/github">
        <a className={topStyles.more}>More</a>
      </Link>
    </>
  );
}

export function Top({blogEntries}: {blogEntries: BlogEntry[]}) {
  return (
    <Layout>
      <img
        src="/images/avatar.png"
        alt="numb_86"
        className={topStyles.avatar}
      />
      <h1 className={styles.title}>numb_86</h1>
      <p>ウェブプログラマ</p>

      <ServicesInUse />

      <Products />

      <h2 className={topStyles.headline}>Technical Blog</h2>

      <h3>Pick Up</h3>

      <div className={styles.grid}>
        {blogEntries.map((entry) => (
          <BlogEntryComponent key={entry.url} {...entry} />
        ))}
      </div>
      <Link href="/blog">
        <a className={topStyles.more}>More</a>
      </Link>
    </Layout>
  );
}
