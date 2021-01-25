import {ReactNode} from 'react';

import styles from './transition-button.module.css';

export function TransitionButton({
  onClick,
  isPending,
  children,
}: {
  onClick: () => void;
  isPending: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={styles.button}
        disabled={isPending}
      >
        {children}
      </button>
      {isPending && <span className={styles.spinner} />}
    </>
  );
}
