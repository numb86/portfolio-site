import {useState} from 'react';

import {TransitionButton} from '../../shared/components/TransitionButton';

import styles from './navigation.module.css';

type Category = 'pickUp' | 'popular' | 'recent';

export function Navigation({
  active,
  changeCategory,
  isPending,
}: {
  active: Category;
  changeCategory: (arg: Category) => void;
  isPending: boolean;
}) {
  const [nextActive, setNextActive] = useState<Category>(active);

  const NavItem: React.FC<{categoryName: Category; text: string}> = ({
    categoryName,
    text,
  }) => (
    <li className={`${active === categoryName ? styles.active : ''}`}>
      <TransitionButton
        isPending={isPending && nextActive === categoryName}
        onClick={() => {
          setNextActive(categoryName);
          changeCategory(categoryName);
          window.scrollTo(0, 0);
        }}
      >
        {text}
      </TransitionButton>
    </li>
  );

  return (
    <nav className={styles.container}>
      <ul>
        <NavItem categoryName="pickUp" text="Pick Up" />
        <NavItem categoryName="popular" text="Popular" />
        <NavItem categoryName="recent" text="Recent" />
      </ul>
    </nav>
  );
}
