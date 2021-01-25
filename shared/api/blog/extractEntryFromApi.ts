import {trimIsoString} from '../../trimIsoString';
import {ENTRY_SUMMARY_LENGTH} from '../../constants';

import type {BlogEntry} from '../../../components/Blog/BlogEntry';

export function extractEntryFromApi(
  itemFromApi: any
): Omit<BlogEntry, 'thumbnailUrl'> {
  const title = itemFromApi.title[0];
  const summary = `${itemFromApi.summary[0]._.slice(0, ENTRY_SUMMARY_LENGTH)}…`;
  const published = trimIsoString(itemFromApi.published[0]);

  const url = itemFromApi.link
    .map((item: any) => item.$)
    .find((item: any) => item.type === 'text/html').href;

  return {url, title, summary, published};
}
