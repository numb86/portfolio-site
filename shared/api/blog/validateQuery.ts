import {resFailedJson} from '../utils';

export const POPULAR = 'popular';
export const RECENT = 'recent';

type QueryPattern =
  | typeof POPULAR
  | typeof RECENT
  | Parameters<typeof resFailedJson>[1];

export function validateQuery(
  query: Partial<{[x: string]: string | string[]}>
): QueryPattern {
  const {page, sort} = query;

  const hasInvalidQuery = Object.keys(query).some(
    (key) => key !== 'page' && key !== 'sort'
  );

  if (hasInvalidQuery) {
    return {
      status: 400,
      headers: {
        status: '使用できるクエリは page と sort のみです。',
      },
    };
  }

  if (Array.isArray(page)) {
    return {
      status: 400,
      headers: {
        status: 'page が不正な値です。',
      },
    };
  }

  if (Array.isArray(sort)) {
    return {
      status: 400,
      headers: {
        status: 'sort が不正な値です。',
      },
    };
  }

  if (page && Number.isNaN(Number(page))) {
    return {
      status: 400,
      headers: {
        status: 'page には数値を指定してください。',
      },
    };
  }

  if (sort && sort !== 'popular' && sort !== 'recent') {
    return {
      status: 400,
      headers: {
        status: 'sort に指定できる値は popular か recent のみです。',
      },
    };
  }

  if (page && sort === 'popular') {
    return {
      status: 400,
      headers: {
        status:
          'sort に popular を指定した場合は page を指定することはできません。',
      },
    };
  }

  if (page) return RECENT;

  if (!page && !sort) return RECENT;
  if (!page && sort === 'popular') return POPULAR;
  if (!page && sort === 'recent') return RECENT;

  return {
    status: 500,
    headers: {
      status: '予期しないクエリを受け付けました。',
    },
  };
}
