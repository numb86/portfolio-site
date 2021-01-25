import {Octokit} from '@octokit/rest';

import type {User} from '../../../components/GithubActivity/User';
import {resFailedJson} from '../utils';

export async function fetchSpecifiedUser(userName: string, octokit: Octokit) {
  try {
    const res = await octokit.request('GET /users/{username}', {
      username: userName,
    });

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`/users/${userName}`, res.headers['x-ratelimit-remaining']);
    }

    const {
      // eslint-disable-next-line camelcase
      data: {name, login, avatar_url, bio, html_url, type},
    } = res;

    const user: User = {
      name,
      login,
      avatarUrl: avatar_url,
      bio,
      githubUrl: html_url,
      type,
    };

    return user;
  } catch (e) {
    return e as Parameters<typeof resFailedJson>[1];
  }
}
