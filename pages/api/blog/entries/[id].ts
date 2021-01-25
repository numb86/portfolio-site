// /api/blog/entries/[id]

import {NextApiRequest, NextApiResponse} from 'next';

import {isBlogEntry} from '../../../../components/Blog/BlogEntry';
import {fetchSpecifiedEntry} from '../../../../shared/api/blog/fetchSpecifiedEntry';
import {
  resSuccessfulJson,
  resFailedJson,
  resNotFound,
  resForbidden,
  isInvalidAccess,
} from '../../../../shared/api/utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (isInvalidAccess(req)) {
    resForbidden(res);
    return;
  }

  const {
    query: {id},
  } = req;

  if (Array.isArray(id)) {
    resNotFound(res);
    return;
  }

  const result = await fetchSpecifiedEntry(id);

  if (!isBlogEntry(result)) {
    resFailedJson(res, result);
    return;
  }

  resSuccessfulJson(res, result);
};
