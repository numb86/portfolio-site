export function isDraftEntry(itemFromApi: any) {
  return itemFromApi['app:control'][0]['app:draft'][0] === 'yes';
}
