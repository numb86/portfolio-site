// /api/blog/entries?page=[number]&sort=[algorithm]

import {NextApiRequest, NextApiResponse} from 'next';

import {fetchHatenaBlogAtomPub} from '../../../shared/api/blog/fetchHatenaBlogAtomPub';
import {isDraftEntry} from '../../../shared/api/blog/isDraftEntry';
import {extractEntryFromApi} from '../../../shared/api/blog/extractEntryFromApi';
import {fetchThumbnailUrl} from '../../../shared/api/blog/fetchThumbnailUrl';
import {
  validateQuery,
  RECENT,
  POPULAR,
} from '../../../shared/api/blog/validateQuery';
import {
  resSuccessfulJson,
  resFailedJson,
  resNotFound,
  resForbidden,
  isInvalidAccess,
} from '../../../shared/api/utils';
import {trimIsoString} from '../../../shared/trimIsoString';
import {ENTRY_SUMMARY_LENGTH} from '../../../shared/constants';

import type {BlogEntry} from '../../../components/Blog/BlogEntry';

const {promisify} = require('util');
const xml2js = require('xml2js');

const {HATENA_BASIC_AUTH} = process.env;
const PER_PAGE_ENTRY_AMOUNT = 10;
const DEFAULT_PAGE = 1;

const HOT_ENTRY_URL =
  'https://b.hatena.ne.jp/entrylist?url=numb86-tech.hatenablog.com&mode=rss&sort=count';
const ENTRY_LIST_URL =
  'https://blog.hatena.ne.jp/numb_86/numb86-tech.hatenablog.com/atom/entry';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (isInvalidAccess(req)) {
    resForbidden(res);
    return;
  }

  const {query} = req;

  const queryPattern = validateQuery(query);

  if (queryPattern !== RECENT && queryPattern !== POPULAR) {
    resFailedJson(res, queryPattern);
    return;
  }

  if (queryPattern === POPULAR) {
    const xml = await fetch(HOT_ENTRY_URL).then((r) => r.text());

    const result = await promisify(xml2js.parseString)(xml);
    const {item} = result['rdf:RDF'];

    if (!item) {
      resNotFound(res);
      return;
    }

    const entries: BlogEntry[] = item.map(
      (i: any): BlogEntry => ({
        url: i.link[0],
        title: i.title[0],
        summary: `${i.description[0].slice(0, ENTRY_SUMMARY_LENGTH)}…`,
        published: trimIsoString(i['dc:date'][0]),
        thumbnailUrl: i['hatena:imageurl'][0],
      })
    );

    resSuccessfulJson(res, entries);
    return;
  }

  if (queryPattern === RECENT) {
    if (!HATENA_BASIC_AUTH) {
      resFailedJson(res, {
        status: 500,
        headers: {
          status:
            'ブログサービスを提供している事業者の API にアクセスできませんでした。',
        },
      });
      return;
    }

    const fetchPublishedItemByPage = async (
      url: string
    ): Promise<{
      publishedItems: any[];
      nextUrl: string | null;
    }> => {
      const data = await fetchHatenaBlogAtomPub(url, HATENA_BASIC_AUTH);

      const isSuccess = (result: typeof data): result is string =>
        typeof result === 'string';

      if (!isSuccess(data)) {
        throw new Error(JSON.stringify(data));
      }

      const {
        feed: {entry: items, link},
      } = await promisify(xml2js.parseString)(data);

      const targetLinkElem: {href: string} | undefined = link
        .map((item: any) => item.$)
        .find((item: any) => item.rel === 'next');
      const nextUrl = targetLinkElem ? targetLinkElem.href : null;

      const publishedItems = items.filter(
        (item: any): boolean => !isDraftEntry(item)
      );

      return {publishedItems, nextUrl};
    };

    const targetPage = Number(query.page) || DEFAULT_PAGE;
    const entryRequiredAmount = PER_PAGE_ENTRY_AMOUNT * targetPage;
    const publishedItemAccumulation: any[] = [];

    const fetchUntilEntryAccumulated = async (url: string) => {
      const {publishedItems, nextUrl} = await fetchPublishedItemByPage(url);
      publishedItemAccumulation.push(...publishedItems);
      if (publishedItemAccumulation.length < entryRequiredAmount && nextUrl) {
        await fetchUntilEntryAccumulated(nextUrl);
      }
    };

    try {
      await fetchUntilEntryAccumulated(ENTRY_LIST_URL);
    } catch (e) {
      resFailedJson(res, JSON.parse(e.message));
      return;
    }

    const startPoint = 1 + PER_PAGE_ENTRY_AMOUNT * (targetPage - 1);

    const notExistsTargetEntry = publishedItemAccumulation.length < startPoint;
    if (notExistsTargetEntry) {
      resSuccessfulJson(res, []);
      return;
    }

    publishedItemAccumulation.splice(0, startPoint - 1);
    publishedItemAccumulation.splice(PER_PAGE_ENTRY_AMOUNT);

    const entriesPromise: Promise<BlogEntry>[] = publishedItemAccumulation.map(
      async (item: any): Promise<BlogEntry> => {
        const incompleteEntry = extractEntryFromApi(item);
        const thumbnailUrl = await fetchThumbnailUrl(incompleteEntry.url);
        return {
          ...incompleteEntry,
          thumbnailUrl,
        };
      }
    );

    const entries = await Promise.all(entriesPromise);

    resSuccessfulJson(res, entries);
    return;
  }

  resFailedJson(res, {
    status: 500,
    headers: {
      status: '予期しないクエリを受け付けました。',
    },
  });
};
