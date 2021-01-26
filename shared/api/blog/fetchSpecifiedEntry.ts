import {fetchHatenaBlogAtomPub} from './fetchHatenaBlogAtomPub';
import {isDraftEntry} from './isDraftEntry';
import {extractEntryFromApi} from './extractEntryFromApi';
import {fetchThumbnailUrl} from './fetchThumbnailUrl';
import {resFailedJson} from '../utils';

import type {BlogEntry} from '../../../components/Blog/BlogEntry';

const {promisify} = require('util');
const xml2js = require('xml2js');

const {HATENA_BASIC_AUTH} = process.env;

export async function fetchSpecifiedEntry(
  id: string
): Promise<BlogEntry | Parameters<typeof resFailedJson>[1]> {
  if (!HATENA_BASIC_AUTH) {
    return {
      status: 500,
      headers: {
        status:
          'ブログサービスを提供している事業者の API にアクセスできませんでした。',
      },
    };
  }

  const data = await fetchHatenaBlogAtomPub(
    `https://blog.hatena.ne.jp/numb_86/numb86-tech.hatenablog.com/atom/entry/${id}`,
    HATENA_BASIC_AUTH
  );

  const isSuccess = (result: typeof data): result is string =>
    typeof result === 'string';

  if (!isSuccess(data)) {
    return data;
  }

  const {entry} = await promisify(xml2js.parseString)(data);

  if (isDraftEntry(entry)) {
    return {
      status: 404,
      headers: {status: 'Not Found'},
    };
  }

  const incompleteEntry = extractEntryFromApi(entry);
  const thumbnailUrl = await fetchThumbnailUrl(incompleteEntry.url);
  return {
    ...incompleteEntry,
    thumbnailUrl,
  };
}
