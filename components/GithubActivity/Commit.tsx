import {Fragment, useState, useEffect, useRef} from 'react';
import useSWR from 'swr';

import {TransitionButton} from '../../shared/components/TransitionButton';
import {useEnteredViewportOnce} from '../../shared/useEnteredViewportOnce';
import {fetcher} from '../../shared/fetcher';
import {
  getUserApiUrl,
  getRepositoryApiUrl,
} from '../../shared/api/github/getEndPointUrl';

import styles from '../../styles/utils.module.css';
import githubActivityStyles from './github-activity.module.css';

import type {GithubActivityState} from './GithubActivityContent';
import type {User} from './User';
import type {Repository} from './Repository';

export type Commit = {
  sha: string;
  message: string;
  repository: {
    name: string;
    owner: string;
  };
  author: {
    name: string | null;
    login: string | null;
  };
  date: string | null;
};

type Props = Commit & {
  setState: (state: GithubActivityState) => void;
};

export function CommitComponent({
  sha,
  message,
  repository,
  author,
  date,
  setState,
}: Props) {
  const [pending, setPending] = useState({
    repository: false,
    repositoryOwner: false,
    author: false,
  });

  const ref = useRef<HTMLDivElement>(null);

  const [isEnablePreFetch] = useEnteredViewportOnce(ref);

  const {
    data: preFetchedOwner,
    error: preFetchedOwnerError,
  }: {data?: User; error?: Error} = useSWR(
    isEnablePreFetch ? getUserApiUrl(repository.owner) : null,
    fetcher
  );

  const {
    data: preFetchedRepository,
    error: preFetchedRepositoryError,
  }: {data?: Repository; error?: Error} = useSWR(
    isEnablePreFetch
      ? getRepositoryApiUrl(repository.owner, repository.name)
      : null,
    fetcher
  );

  const {
    data: preFetchedAuthor,
    error: preFetchedAuthorError,
  }: {data?: User; error?: Error} = useSWR(
    isEnablePreFetch && author.login ? getUserApiUrl(author.login) : null,
    fetcher
  );

  const preFetchStatus = useRef({
    preFetchedOwner,
    preFetchedRepository,
    preFetchedAuthor,
  });

  useEffect(() => {
    preFetchStatus.current = {
      preFetchedOwner,
      preFetchedRepository,
      preFetchedAuthor,
    };
  }, [preFetchedOwner, preFetchedRepository, preFetchedAuthor]);

  const errors = [
    preFetchedOwnerError,
    preFetchedRepositoryError,
    preFetchedAuthorError,
  ];
  const error = errors.find((e) => e instanceof Error);

  if (error) {
    throw error;
  }

  const showRepository = () => {
    const latestValue = preFetchStatus.current.preFetchedRepository;
    if (latestValue !== undefined) {
      setState({
        users: null,
        repositories: [latestValue],
        commits: null,
      });
      return;
    }
    setTimeout(showRepository, 500);
  };

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

  const showAuthor = () => {
    const latestValue = preFetchStatus.current.preFetchedAuthor;
    if (latestValue !== undefined) {
      setState({
        users: [latestValue],
        repositories: null,
        commits: null,
      });
      return;
    }
    setTimeout(showAuthor, 500);
  };

  const [messageHeadline, messageDescription] = message.split('\n\n') as [
    string,
    string | undefined
  ];

  const formattedMessageDescription = messageDescription
    ?.split('\r\n\r\n')
    .map((text, index) => {
      if (index === 0) return text;
      return (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={text + index}>
          <br />
          {text}
        </Fragment>
      );
    });

  return (
    <div className={styles.card}>
      <div ref={ref} className={styles.card_inner}>
        <div className={githubActivityStyles.commit}>
          <h2>{messageHeadline}</h2>

          {messageDescription && (
            <p className={githubActivityStyles.description}>
              {formattedMessageDescription}
            </p>
          )}

          <p>
            <b>Repository: </b>
            <TransitionButton
              onClick={() => {
                setPending({
                  repository: false,
                  repositoryOwner: true,
                  author: false,
                });
                showOwner();
              }}
              isPending={pending.repositoryOwner}
            >
              {repository.owner}
            </TransitionButton>{' '}
            /{' '}
            <TransitionButton
              onClick={() => {
                setPending({
                  repository: true,
                  repositoryOwner: false,
                  author: false,
                });
                showRepository();
              }}
              isPending={pending.repository}
            >
              {repository.name}
            </TransitionButton>
          </p>

          {author.login && (
            <p>
              <b>Author: </b>
              <TransitionButton
                onClick={() => {
                  setPending({
                    repository: false,
                    repositoryOwner: false,
                    author: true,
                  });
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  showAuthor();
                }}
                isPending={pending.author}
              >
                {author.name || author.login}
              </TransitionButton>
            </p>
          )}

          {date && (
            <p>
              <b>Date: </b>
              {date}
            </p>
          )}

          <p>
            <a
              href={`https://github.com/${repository.owner}/${repository.name}/commit/${sha}`}
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
