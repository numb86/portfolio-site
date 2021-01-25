import {ReactNode} from 'react';

import {Header} from '../components/Header';
import styles from './layout.module.css';

export function Layout({children}: {children: ReactNode}) {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
