import {NextApiRequest, NextApiResponse} from 'next';

import {API_ROUTES_AUTH_HEADER} from '../constants';

type ErrorDetail = {
  status: number;
  headers: {
    status: string;
  };
};

export function resSuccessfulJson(res: NextApiResponse, data: unknown) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'max-age=300',
  });
  res.write(JSON.stringify(data));
  res.end();
}

export function resFailedJson(res: NextApiResponse, error: ErrorDetail) {
  res.writeHead(error.status, {
    'Content-Type': 'application/json',
  });
  res.write(JSON.stringify({error: error.headers.status}));
  res.end();
}

export function resNotFound(res: NextApiResponse) {
  res.writeHead(404, {
    'Content-Type': 'application/json',
  });
  res.write(JSON.stringify({error: 'Not Found'}));
  res.end();
}

export function resForbidden(res: NextApiResponse) {
  res.writeHead(403, {
    'Content-Type': 'application/json',
  });
  res.write(JSON.stringify({error: 'Forbidden'}));
  res.end();
}

function isExternalAccess(req: NextApiRequest) {
  const {referer} = req.headers;

  if (!referer) {
    return true;
  }

  if (process.env.NEXT_PUBLIC_API_SERVER_URL === undefined) {
    throw new Error('process.env.NEXT_PUBLIC_API_SERVER_URL is undefined.');
  }

  if (referer.includes(process.env.NEXT_PUBLIC_API_SERVER_URL)) {
    return false;
  }

  return true;
}

export function isInvalidAccess(req: NextApiRequest) {
  return (
    isExternalAccess(req) &&
    req.headers[API_ROUTES_AUTH_HEADER] !== process.env.API_ROUTES_AUTH
  );
}
