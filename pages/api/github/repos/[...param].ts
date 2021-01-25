// /api/github/repos/[owner]/[repo]/commits
// /api/github/repos/[owner]/[repo]

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

import type {Repository} from '../../../../components/GithubActivity/Repository';
import type {Commit} from '../../../../components/GithubActivity/Commit';

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

  if (param.length === 1 || param.length > 3) {
    resNotFound(res);
    return;
  }

  const [owner, repoName, thirdPath] = param as [
    string,
    string,
    string | undefined
  ];

  // Return basic info about repository
  if (thirdPath === undefined) {
    try {
      const {data, headers} = await octokit.repos.get({
        owner,
        repo: repoName,
      });

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(
          `/repos/${owner}/${repoName}`,
          headers['x-ratelimit-remaining']
        );
      }

      const language = data.language
        ? {
            name: data.language,
            color: getLanguageColor(data.language, colorJson),
          }
        : null;

      const repository: Repository = {
        name: repoName,
        owner,
        description: data.description || '',
        language,
        star: data.stargazers_count,
        updatedAt: trimIsoString(data.updated_at),
      };

      resSuccessfulJson(res, repository);
    } catch (e) {
      resFailedJson(res, e);
    }

    return;
  }

  // Return commit list
  if (thirdPath === 'commits') {
    try {
      const {data, headers} = await octokit.request(
        'GET /repos/{owner}/{repo}/commits',
        {
          owner,
          repo: repoName,
        }
      );

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(
          `/repos/${owner}/${repoName}/commits`,
          headers['x-ratelimit-remaining']
        );
      }

      const commits: Commit[] = data
        .filter((c) => c.sha !== null)
        .map((c) => {
          const {author} = c.commit;
          const date = author ? author.date : null;

          return {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            sha: c.sha!,
            message: c.commit.message,
            repository: {
              name: repoName,
              owner,
            },
            author: {
              name: (c.commit.author ? c.commit.author.name : null) || null,
              login: (c.author ? c.author.login : null) || null,
            },
            date: date ? trimIsoString(date) : null,
          };
        });

      resSuccessfulJson(res, await Promise.all(commits));
    } catch (e) {
      resFailedJson(res, e);
    }

    return;
  }

  resNotFound(res);
};
