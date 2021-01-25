export async function fetcher(url: string) {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify({...json, statusCode: res.status}));
  }
  return json;
}
