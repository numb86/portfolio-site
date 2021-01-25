// /api/blog/entries/[id]

import {NextApiRequest, NextApiResponse} from 'next';

import {fetchHatenaBlogAtomPub} from '../../../../shared/api/blog/fetchHatenaBlogAtomPub';
import {isDraftEntry} from '../../../../shared/api/blog/isDraftEntry';
import {extractEntryFromApi} from '../../../../shared/api/blog/extractEntryFromApi';
import {fetchThumbnailUrl} from '../../../../shared/api/blog/fetchThumbnailUrl';
import {
  resSuccessfulJson,
  resFailedJson,
  resNotFound,
  resForbidden,
  isInvalidAccess,
} from '../../../../shared/api/utils';

import type {BlogEntry} from '../../../../components/Blog/BlogEntry';

const {promisify} = require('util');
const xml2js = require('xml2js');

const {HATENA_BASIC_AUTH} = process.env;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (isInvalidAccess(req)) {
    resForbidden(res);
    return;
  }

  const {
    query: {id},
  } = req;

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

  const data = await fetchHatenaBlogAtomPub(
    `https://blog.hatena.ne.jp/numb_86/numb86-tech.hatenablog.com/atom/entry/${id}`,
    HATENA_BASIC_AUTH
  );

  const isSuccess = (result: typeof data): result is string =>
    typeof result === 'string';

  if (!isSuccess(data)) {
    resFailedJson(res, data);
    return;
  }

  const {entry} = await promisify(xml2js.parseString)(data);

  if (isDraftEntry(entry)) {
    resNotFound(res);
    return;
  }

  const incompleteEntry = extractEntryFromApi(entry);
  const thumbnailUrl = await fetchThumbnailUrl(incompleteEntry.url);
  const result: BlogEntry = {
    ...incompleteEntry,
    thumbnailUrl,
  };

  resSuccessfulJson(res, result);
};
