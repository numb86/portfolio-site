import {GetStaticProps} from 'next';
import Head from 'next/head';

import {GithubActivity} from '../components/GithubActivity/index';
import {fetcher} from '../shared/fetcher';
import {getUserApiUrl} from '../shared/api/github/getEndPointUrl';

import type {User} from '../components/GithubActivity/User';

const INITIAL_USER_NAME = 'numb86';

const PAGE_TITLE = 'GitHub Activity - numb86.net';

export default function GithubPage({user}: {user: User}) {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_API_SERVER_URL}/github`}
        />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:type" content="article" />
        <meta name="twitter:title" content={PAGE_TITLE} />
      </Head>
      <GithubActivity user={user} />
    </>
  );
}

export async function getStaticProps(): Promise<ReturnType<GetStaticProps>> {
  const user: User = await fetcher(
    getUserApiUrl(INITIAL_USER_NAME),
    process.env.API_ROUTES_AUTH
  );

  return {
    props: {user},
  };
}
