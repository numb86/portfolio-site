import {useState} from 'react';

import {UserComponent} from './User';
import {RepositoryComponent} from './Repository';
import {CommitComponent} from './Commit';
import githubActivityStyles from './github-activity.module.css';

import type {User} from './User';
import type {Repository} from './Repository';
import type {Commit} from './Commit';

const DISPLAYED_ITEM_COUNT_AT_ONE_TIME = 8;

export type GithubActivityState = {
  users: User[] | null;
  repositories: Repository[] | null;
  commits: Commit[] | null;
};

function isAlreadyDisplayedAllItem(
  state: GithubActivityState,
  allowedDisplayCount: number
) {
  const targetItems: NonNullable<
    GithubActivityState[keyof GithubActivityState]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  > = Object.values(state).find((value) => value !== null)!;
  return targetItems.length <= allowedDisplayCount;
}

export function GithubActivityContent({
  state,
  setState,
}: {
  state: GithubActivityState;
  setState: (newPresent: GithubActivityState) => void;
}) {
  const [displayedItemCount, setDisplayedItemCount] = useState(
    DISPLAYED_ITEM_COUNT_AT_ONE_TIME
  );

  const enhanceSetState = (receiveState: GithubActivityState) => {
    setState(receiveState);
    setDisplayedItemCount(DISPLAYED_ITEM_COUNT_AT_ONE_TIME);
    window.scrollTo(0, 0);
  };

  const extractDisplayedItems: <T>(allItems: T[]) => T[] = (allItems) =>
    allItems.slice(0, displayedItemCount);

  const {users, repositories, commits} = state;

  return (
    <>
      {users &&
        extractDisplayedItems(users).map((user) => (
          <UserComponent
            key={user.login}
            setState={enhanceSetState}
            {...user}
          />
        ))}
      {repositories &&
        extractDisplayedItems(repositories).map((repo) => (
          <RepositoryComponent
            key={repo.name}
            setState={enhanceSetState}
            {...repo}
          />
        ))}
      {commits &&
        extractDisplayedItems(commits).map((commit) => (
          <CommitComponent
            key={commit.sha}
            setState={enhanceSetState}
            {...commit}
          />
        ))}
      {!isAlreadyDisplayedAllItem(state, displayedItemCount) && (
        <p className={githubActivityStyles.more}>
          <button
            type="button"
            onClick={() => {
              setDisplayedItemCount(
                (c) => c + DISPLAYED_ITEM_COUNT_AT_ONE_TIME
              );
            }}
          >
            Load More
          </button>
        </p>
      )}
    </>
  );
}
