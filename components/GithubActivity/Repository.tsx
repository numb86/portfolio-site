import {useState, useEffect, useRef} from 'react';
import useSWR from 'swr';

import {UsedLanguage} from '../../shared/components/UsedLanguage';
import {TransitionButton} from '../../shared/components/TransitionButton';
import {useEnteredViewportOnce} from '../../shared/useEnteredViewportOnce';
import {fetcher} from '../../shared/fetcher';
import {
  getRepositoryApiUrl,
  getUserApiUrl,
  getRepositoryCommitsApiUrl,
} from '../../shared/api/github/getEndPointUrl';

import styles from '../../styles/utils.module.css';
import githubActivityStyles from './github-activity.module.css';

import type {GithubActivityState} from './GithubActivityContent';
import type {User} from './User';
import type {Commit} from './Commit';

export type Repository = {
  name: string;
  owner: string;
  description: string;
  language: React.ComponentProps<typeof UsedLanguage> | null;
  star: number;
  updatedAt: string;
};

type Props = Repository & {
  setState: (state: GithubActivityState) => void;
};

export function RepositoryComponent({
  name,
  owner,
  description,
  star,
  language,
  updatedAt,
  setState,
}: Props) {
  const [pending, setPending] = useState({
    owner: false,
    recentCommits: false,
  });

  const ref = useRef<HTMLDivElement>(null);

  const [isEnablePreFetch] = useEnteredViewportOnce(ref);

  useSWR(
    getRepositoryApiUrl(owner, name),
    (): Promise<Repository> =>
      Promise.resolve({
        name,
        owner,
        description,
        star,
        language,
        updatedAt,
      })
  );

  const {
    data: preFetchedOwner,
    error: preFetchedOwnerError,
  }: {data?: User; error?: Error} = useSWR(
    isEnablePreFetch ? getUserApiUrl(owner) : null,
    fetcher
  );

  const {
    data: preFetchedCommits,
    error: preFetchedCommitsError,
  }: {data?: Commit[]; error?: Error} = useSWR(
    isEnablePreFetch ? getRepositoryCommitsApiUrl(owner, name) : null,
    fetcher
  );

  const preFetchStatus = useRef({
    preFetchedOwner,
    preFetchedCommits,
  });

  useEffect(() => {
    preFetchStatus.current = {
      preFetchedOwner,
      preFetchedCommits,
    };
  }, [preFetchedOwner, preFetchedCommits]);

  const errors = [preFetchedOwnerError, preFetchedCommitsError];
  const error = errors.find((e) => e instanceof Error);

  if (error) {
    throw error;
  }

  const showOwner = () => {
    const latestValue = preFetchStatus.current.preFetchedOwner;
    if (latestValue !== undefined) {
      setState({
        users: [latestValue],
        repositories: null,
        commits: null,
      });
      return;
    }
    setTimeout(showOwner, 500);
  };

  const showCommits = () => {
    const latestValue = preFetchStatus.current.preFetchedCommits;
    if (latestValue !== undefined) {
      setState({
        users: null,
        repositories: null,
        commits: latestValue,
      });
      return;
    }
    setTimeout(showCommits, 500);
  };

  return (
    <div className={styles.card}>
      <div ref={ref} className={styles.card_inner}>
        <div className={githubActivityStyles.repository}>
          <p>
            <b>
              <TransitionButton
                onClick={() => {
                  setPending({
                    owner: true,
                    recentCommits: false,
                  });
                  showOwner();
                }}
                isPending={pending.owner}
              >
                <b>{owner}</b>
              </TransitionButton>
            </b>{' '}
            / <b>{name}</b>
          </p>
          <p>{description}</p>

          {language && (
            <>
              <p>
                <b>Language</b>
              </p>
              <UsedLanguage {...language} />
            </>
          )}

          <p>
            <b>Star: </b>
            {star}
          </p>

          <p>
            <b>Last Update: </b>
            {updatedAt}
          </p>

          <p>
            <TransitionButton
              onClick={() => {
                setPending({
                  owner: false,
                  recentCommits: true,
                });
                showCommits();
              }}
              isPending={pending.recentCommits}
            >
              Recent Commits
            </TransitionButton>
          </p>

          <p>
            <a
              href={`https://github.com/${owner}/${name}`}
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
  );
}
