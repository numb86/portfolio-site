export function trimIsoString(isoString: string) {
  const result = isoString.replace('T', ' ').replace('Z', '');
  const index = result.indexOf('+');
  if (index === -1) return result;
  return result.slice(0, index);
}
