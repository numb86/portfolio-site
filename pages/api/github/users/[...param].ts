// /api/github/users/[name]
// /api/github/users/[name]/repos

import {NextApiRequest, NextApiResponse} from 'next';
import {Octokit} from '@octokit/rest';

import {isUser} from '../../../../components/GithubActivity/User';
import {fetchSpecifiedUser} from '../../../../shared/api/github/fetchSpecifiedUser';
import {
  resSuccessfulJson,
  resFailedJson,
  resNotFound,
  resForbidden,
  isInvalidAccess,
} from '../../../../shared/api/utils';
import {getLanguageColor} from '../../../../shared/api/github/getLanguageColor';
import {colorJson} from '../../../../shared/api/github/colorJson';
import {trimIsoString} from '../../../../shared/trimIsoString';

import type {Repository} from '../../../../components/GithubActivity/Repository';

const MAX_REPOSITORIES_COUNT = 30;

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (isInvalidAccess(req)) {
    resForbidden(res);
    return;
  }

  const {
    query: {param},
  } = req;

  if (param.length > 2) {
    resNotFound(res);
    return;
  }

  const [userName, secondPath] = param as [string, string | undefined];

  // Return basic info about user
  if (secondPath === undefined) {
    const result = await fetchSpecifiedUser(userName, octokit);
    if (!isUser(result)) {
      resFailedJson(res, result);
      return;
    }

    resSuccessfulJson(res, result);

    return;
  }

  // Return repository list
  if (secondPath === 'repos') {
    try {
      const {data, headers} = await octokit.request(
        'GET /users/{username}/repos',
        {
          username: userName,
          per_page: 100,
        }
      );

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(
          `/users/${userName}/repos`,
          headers['x-ratelimit-remaining']
        );
      }

      data
        .sort(
          (a, b) =>
            new Date(b.updated_at || 0).getTime() -
            new Date(a.updated_at || 0).getTime()
        )
        .splice(MAX_REPOSITORIES_COUNT);

      const repositories: Repository[] = data.map((repo) => {
        const language = repo.language
          ? {
              name: repo.language,
              color: getLanguageColor(repo.language, colorJson),
            }
          : null;

        return {
          name: repo.name,
          owner: repo.owner ? repo.owner.login : '',
          description: repo.description || '',
          language,
          star: repo.stargazers_count || 0,
          updatedAt: trimIsoString(repo.updated_at || ''),
        };
      });

      resSuccessfulJson(res, await Promise.all(repositories));
    } catch (e) {
      resFailedJson(res, e);
    }

    return;
  }

  resNotFound(res);
};
