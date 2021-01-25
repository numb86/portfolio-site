import {GetStaticProps} from 'next';
import Head from 'next/head';
import {Octokit} from '@octokit/rest';

import {GithubActivity} from '../components/GithubActivity/index';
import {fetchSpecifiedUser} from '../shared/api/github/fetchSpecifiedUser';
import {isUser} from '../components/GithubActivity/User';

import type {User} from '../components/GithubActivity/User';

const INITIAL_USER_NAME = 'numb86';

const PAGE_TITLE = "GitHub Activity - numb86's portfolio";

export default function GithubPage({user}: {user: User}) {
  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_SITE_FQDN}/github`}
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
  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

  const result = await fetchSpecifiedUser(INITIAL_USER_NAME, octokit);

  if (!isUser(result)) {
    throw new Error(result.headers.status);
  }

  return {
    props: {user: result},
  };
}
