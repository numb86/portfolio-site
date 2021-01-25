import {parse} from 'node-html-parser';

import {resFailedJson} from '../utils';

export async function fetchHatenaBlogAtomPub(
  url: string,
  auth: string
): Promise<string | Parameters<typeof resFailedJson>[1]> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic: ${auth}`,
    },
  });

  const text = await res.text();

  if (res.ok) {
    return text;
  }

  return {
    status: res.status,
    headers: {
      // Depending on the error, the text may be plain text or HTML.
      // e.g In cases where the blog FQDN was wrong, plain text.
      // e.g In cases where auth token was wrong, html text.
      // Therefore, it is parsed.
      status: parse(text).innerText.trim(),
    },
  };
}
