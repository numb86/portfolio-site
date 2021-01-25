import {TransitionButton} from '../../shared/components/TransitionButton';

import styles from './load-more-button.module.css';

export function LoadMoreButton({
  incrementPage,
  isPending,
}: {
  incrementPage: () => void;
  isPending: boolean;
}) {
  return (
    <p className={styles.container}>
      <TransitionButton onClick={incrementPage} isPending={isPending}>
        Load More
      </TransitionButton>
    </p>
  );
}
