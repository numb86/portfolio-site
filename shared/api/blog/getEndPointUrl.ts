export function getEntryApiUrl(entryId: string) {
  return `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/blog/entries/${entryId}`;
}

export function getPopularEntriesApiUrl() {
  return `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/blog/entries?sort=popular`;
}

export function getRecentEntriesApiUrl(page: number) {
  return `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/blog/entries?page=${page}`;
}
