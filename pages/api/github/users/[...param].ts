// /api/github/users/[name]
// /api/github/users/[name]/repos

import {NextApiRequest, NextApiResponse} from 'next';
import {Octokit} from '@octokit/rest';

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

import type {User} from '../../../../components/GithubActivity/User';
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
    octokit
      .request('GET /users/{username}', {
        username: userName,
      })
      .then((githubRes) => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(
            `/users/${userName}`,
            githubRes.headers['x-ratelimit-remaining']
          );
        }

        const {
          // eslint-disable-next-line camelcase
          data: {name, login, avatar_url, bio, html_url, type},
        } = githubRes;

        const user: User = {
          name,
          login,
          avatarUrl: avatar_url,
          bio,
          githubUrl: html_url,
          type,
        };

        resSuccessfulJson(res, user);
      })
      .catch((error) => {
        resFailedJson(res, error);
      });

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
