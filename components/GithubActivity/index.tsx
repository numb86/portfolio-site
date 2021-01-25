import {ReactNode, ComponentProps} from 'react';
import useUndo from 'use-undo';

import {GithubActivityContent} from './GithubActivityContent';
import {Layout} from '../../shared/components/Layout';
import {ErrorBoundary} from '../../shared/components/ErrorBoundary';
import {ErrorMessage} from '../../shared/components/ErrorMessage';

import styles from '../../styles/utils.module.css';
import githubActivityStyles from './github-activity.module.css';

import type {User} from './User';

function SideButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <div className={githubActivityStyles.side_button_container}>
      <div className={githubActivityStyles.side_button}>
        <div>
          <button type="button" onClick={onClick}>
            {children}
          </button>
        </div>
      </div>
    </div>
  );
}

function BackButton({back}: {back: () => void}) {
  return (
    <div className={githubActivityStyles.back_grid}>
      <SideButton onClick={back}>
        &#x2190;
        <br />
        Back
      </SideButton>
    </div>
  );
}

function ForwardButton({forward}: {forward: () => void}) {
  return (
    <div className={githubActivityStyles.forward_grid}>
      <SideButton onClick={forward}>
        &#x2192;
        <br />
        Forward
      </SideButton>
    </div>
  );
}

export function GithubActivity({user}: {user: User}) {
  const [history, {set: setState, undo, redo, canUndo, canRedo}] = useUndo<
    ComponentProps<typeof GithubActivityContent>['state']
  >({
    users: [user],
    repositories: null,
    commits: null,
  });
  const {present: state} = history;

  const hasEmptyArray = Object.values(state).some(
    (value) => Array.isArray(value) && value.length === 0
  );

  return (
    <Layout>
      <h1 className={styles.title}>GitHub Activity</h1>
      <div className={githubActivityStyles.container}>
        {canUndo && <BackButton back={undo} />}

        <div className={githubActivityStyles.content_grid}>
          {hasEmptyArray ? (
            <p>該当する情報が見つかりませんでした。</p>
          ) : (
            <ErrorBoundary
              Content={({error}) => <ErrorMessage error={error} />}
            >
              <GithubActivityContent state={state} setState={setState} />
            </ErrorBoundary>
          )}
        </div>

        {canRedo && <ForwardButton forward={redo} />}
      </div>
    </Layout>
  );
}
