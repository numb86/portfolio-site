import {GetStaticProps} from 'next';
import Head from 'next/head';

import {Top} from '../components/Top';
import {fetchSpecifiedEntry} from '../shared/api/blog/fetchSpecifiedEntry';
import {isBlogEntry} from '../components/Blog/BlogEntry';
import {PICK_UP_ENTRY_ID_LIST} from '../shared/constants';

import type {BlogEntry} from '../components/Blog/BlogEntry';

const PAGE_TITLE = "numb86's portfolio";

export default function TopPage({entries}: {entries: BlogEntry[]}) {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta property="og:url" content={process.env.SITE_FQDN} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={PAGE_TITLE} />
      </Head>
      <Top blogEntries={entries} />
    </>
  );
}

export async function getStaticProps(): Promise<ReturnType<GetStaticProps>> {
  const promiseEntries: Promise<BlogEntry>[] = PICK_UP_ENTRY_ID_LIST.map(
    async (id) => {
      const res = await fetchSpecifiedEntry(id);
      if (!isBlogEntry(res)) {
        throw new Error(res.headers.status);
      }
      return res;
    }
  );

  const entries: BlogEntry[] = await Promise.all(promiseEntries);

  return {
    props: {entries},
  };
}
