// /api/github/orgs/[org]/members

import {NextApiRequest, NextApiResponse} from 'next';
import {Octokit} from '@octokit/rest';

import {
  resSuccessfulJson,
  resFailedJson,
  resNotFound,
  resForbidden,
  isInvalidAccess,
} from '../../../../shared/api/utils';

import type {User} from '../../../../components/GithubActivity/User';

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (isInvalidAccess(req)) {
    resForbidden(res);
    return;
  }

  const {
    query: {param},
  } = req;

  if (param.length !== 2) {
    resNotFound(res);
    return;
  }

  const [org, secondPath] = param as [string, string];

  // return member list
  if (secondPath === 'members') {
    octokit
      .request('GET /orgs/{org}/members', {
        org,
        per_page: 100,
      })
      .then(({data, headers}) => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(`/orgs/${org}/members`, headers['x-ratelimit-remaining']);
        }

        const members: User[] = data
          .filter((member) => member !== null)
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          .map((member) => ({
            name: null,
            login: member!.login,
            avatarUrl: member!.avatar_url,
            bio: '',
            githubUrl: member!.html_url,
            type: member!.type,
          }));
        /* eslint-enable @typescript-eslint/no-non-null-assertion */

        resSuccessfulJson(res, members);
      })
      .catch((error) => {
        resFailedJson(res, error);
      });

    return;
  }

  resNotFound(res);
};
