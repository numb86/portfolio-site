import {parse} from 'node-html-parser';

export async function fetchThumbnailUrl(entryUrl: string): Promise<string> {
  const html = await fetch(entryUrl).then((r) => r.text());
  const thumbnailUrl = parse(html).querySelector('meta[property="og:image"]')
    .rawAttributes.content;
  return thumbnailUrl;
}
