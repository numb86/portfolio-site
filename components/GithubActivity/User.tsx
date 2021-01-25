import {useState, useEffect, useRef} from 'react';
import useSWR from 'swr';

import {TransitionButton} from '../../shared/components/TransitionButton';
import {useEnteredViewportOnce} from '../../shared/useEnteredViewportOnce';
import {fetcher} from '../../shared/fetcher';
import {
  getUserApiUrl,
  getUserRepositoriesApiUrl,
  getMemberApiUrl,
} from '../../shared/api/github/getEndPointUrl';

import styles from '../../styles/utils.module.css';
import githubActivityStyles from './github-activity.module.css';

import type {GithubActivityState} from './GithubActivityContent';
import type {Repository} from './Repository';

export type User = {
  name: string | null;
  login: string;
  avatarUrl: string;
  bio: string | null;
  githubUrl: string;
  type: 'User' | 'Organization' | 'Bot' | string;
};

type Props = User & {
  setState: (state: GithubActivityState) => void;
};

export function UserComponent({
  name,
  login,
  avatarUrl,
  bio,
  githubUrl,
  type,
  setState,
}: Props) {
  const [pending, setPending] = useState({
    repositories: false,
    members: false,
  });

  const ref = useRef<HTMLDivElement>(null);

  const [isEnablePreFetch] = useEnteredViewportOnce(ref);

  useSWR(
    getUserApiUrl(login),
    (): Promise<User> =>
      Promise.resolve({
        name,
        login,
        avatarUrl,
        bio,
        githubUrl,
        type,
      })
  );

  const {
    data: preFetchedRepositories,
    error: preFetchedRepositoriesError,
  }: {data?: Repository[]; error?: Error} = useSWR(
    isEnablePreFetch ? getUserRepositoriesApiUrl(login) : null,
    fetcher
  );

  const {
    data: preFetchedMembers,
    error: preFetchedMembersError,
  }: {data?: User[]; error?: Error} = useSWR(
    isEnablePreFetch && type === 'Organization' ? getMemberApiUrl(login) : null,
    fetcher
  );

  const preFetchStatus = useRef({
    preFetchedRepositories,
    preFetchedMembers,
  });

  useEffect(() => {
    preFetchStatus.current = {
      preFetchedRepositories,
      preFetchedMembers,
    };
  }, [preFetchedRepositories, preFetchedMembers]);

  const errors = [preFetchedRepositoriesError, preFetchedMembersError];
  const error = errors.find((e) => e instanceof Error);

  if (error) {
    throw error;
  }

  const showRepositories = () => {
    const latestValue = preFetchStatus.current.preFetchedRepositories;
    if (latestValue !== undefined) {
      setState({
        users: null,
        repositories: latestValue,
        commits: null,
      });
      return;
    }
    setTimeout(showRepositories, 500);
  };

  const showMembers = () => {
    const latestValue = preFetchStatus.current.preFetchedMembers;
    if (latestValue !== undefined) {
      setState({
        users: latestValue,
        repositories: null,
        commits: null,
      });
      return;
    }
    setTimeout(showMembers, 500);
  };

  const displayName = name || login;

  return (
    <div className={styles.card}>
      <div ref={ref} className={styles.card_inner}>
        <div className={githubActivityStyles.user}>
          <img src={avatarUrl} alt={displayName} width="140px" height="140px" />
          <div className={githubActivityStyles.content}>
            <p className={githubActivityStyles.name}>{displayName}</p>
            {bio && <p>{bio}</p>}
            <p>
              <TransitionButton
                onClick={() => {
                  setPending({
                    repositories: true,
                    members: false,
                  });
                  showRepositories();
                }}
                isPending={pending.repositories}
              >
                Repositories
              </TransitionButton>
            </p>
            <p>
              {type === 'Organization' && (
                <TransitionButton
                  onClick={() => {
                    setPending({
                      repositories: false,
                      members: true,
                    });
                    showMembers();
                  }}
                  isPending={pending.members}
                >
                  Members
                </TransitionButton>
              )}
            </p>
            <p>
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className={githubActivityStyles.link}
              >
                view on GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
