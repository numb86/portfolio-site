export function getPopularEntriesApiUrl() {
  return `/api/blog/entries?sort=popular`;
}

export function getRecentEntriesApiUrl(page: number) {
  return `/api/blog/entries?page=${page}`;
}
