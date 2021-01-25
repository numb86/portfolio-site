import {GetStaticProps} from 'next';
import Head from 'next/head';

import {Top} from '../components/Top';
import {fetcher} from '../shared/fetcher';
import {getEntryApiUrl} from '../shared/api/blog/getEndPointUrl';
import {PICK_UP_ENTRY_ID_LIST} from '../shared/constants';

import type {BlogEntry} from '../components/Blog/BlogEntry';

const PAGE_TITLE = 'numb86.net';

export default function TopPage({entries}: {entries: BlogEntry[]}) {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta
          property="og:url"
          content={process.env.NEXT_PUBLIC_API_SERVER_URL}
        />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={PAGE_TITLE} />
      </Head>
      <Top blogEntries={entries} />
    </>
  );
}

export async function getStaticProps(): Promise<ReturnType<GetStaticProps>> {
  const promiseEntries: Promise<BlogEntry>[] = PICK_UP_ENTRY_ID_LIST.map((id) =>
    fetcher(getEntryApiUrl(id), process.env.API_ROUTES_AUTH)
  );

  const entries: BlogEntry[] = await Promise.all(promiseEntries);

  return {
    props: {entries},
  };
}
