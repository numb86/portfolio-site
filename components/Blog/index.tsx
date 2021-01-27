import {
  useState,
  // eslint-disable-next-line camelcase
  unstable_useTransition,
  Suspense,
  ComponentProps,
  useEffect,
} from 'react';
import useSWR from 'swr';

import {Layout} from '../../shared/components/Layout';
import {ErrorBoundary} from '../../shared/components/ErrorBoundary';
import {ErrorMessage} from '../../shared/components/ErrorMessage';
import {Navigation} from './Navigation';
import {LoadMoreButton} from './LoadMoreButton';
import {BlogEntryComponent} from './BlogEntry';
import {fetcher as fetchWrapper} from '../../shared/fetcher';
import {
  getPopularEntriesApiUrl,
  getRecentEntriesApiUrl,
} from '../../shared/api/blog/getEndPointUrl';

import styles from '../../styles/utils.module.css';

import type {BlogEntry} from './BlogEntry';

type Category = ComponentProps<typeof Navigation>['active'];

function FetchingBlogEntry({
  category,
  fetcher,
}: {
  category: Category;
  fetcher: (key: Category) => Promise<BlogEntry[]>;
}) {
  const [page, setPage] = useState(1);
  const [isLoadable, setIsLoadable] = useState(true);
  const [startTransition, isPending] = unstable_useTransition();
  const [recentEntriesAccumulation, setRecentEntriesAccumulation] = useState<
    BlogEntry[]
  >([]);

  const incrementPage = () => {
    startTransition(() => {
      setPage((current) => current + 1);
    });
  };

  const {data: entries} = useSWR([category, page], fetcher, {
    suspense: true,
  });

  if (!entries) {
    throw new Error('記事の取得に失敗しました。');
  }

  useEffect(() => {
    if (category === 'recent') {
      setRecentEntriesAccumulation((prev) => {
        const newEntries = entries.filter((e) =>
          prev.every((prevE) => prevE.url !== e.url)
        );
        return [...prev, ...newEntries];
      });
      if (entries.length === 0) {
        setIsLoadable(false);
      }
    } else {
      setRecentEntriesAccumulation([]);
      setPage(1);
      setIsLoadable(true);
    }
  }, [category, entries]);

  if (category === 'recent') {
    return (
      <>
        {recentEntriesAccumulation.map((entry) => (
          <BlogEntryComponent key={entry.url} {...entry} />
        ))}
        {isLoadable && (
          <LoadMoreButton incrementPage={incrementPage} isPending={isPending} />
        )}
      </>
    );
  }

  return (
    <>
      {entries.map((entry) => (
        <BlogEntryComponent key={entry.url} {...entry} />
      ))}
    </>
  );
}

export function Blog({pickUpEntries}: {pickUpEntries: BlogEntry[]}) {
  const [category, setCategory] = useState<Category>('pickUp');
  const [startTransition, isPending] = unstable_useTransition();

  const categoryTransition = (nextCategory: Category) => {
    startTransition(() => {
      setCategory(nextCategory);
    });
  };

  const fetcher = (key: Category, page = 1): Promise<BlogEntry[]> => {
    switch (key) {
      case 'pickUp':
        return Promise.resolve(pickUpEntries);
      case 'popular':
        return fetchWrapper(getPopularEntriesApiUrl());
      case 'recent':
        return fetchWrapper(getRecentEntriesApiUrl(page));
      default: {
        const strangeValue: never = key;
        throw new Error(`${strangeValue} is not valid key.`);
      }
    }
  };

  const nav = (
    <Navigation
      active={category}
      changeCategory={categoryTransition}
      isPending={isPending}
    />
  );

  return (
    <Layout>
      <h1 className={styles.title}>Technical Blog</h1>

      {nav}

      <div className={styles.grid}>
        <ErrorBoundary Content={({error}) => <ErrorMessage error={error} />}>
          <Suspense fallback={null}>
            <FetchingBlogEntry category={category} fetcher={fetcher} />
          </Suspense>
        </ErrorBoundary>
      </div>

      {nav}
    </Layout>
  );
}
