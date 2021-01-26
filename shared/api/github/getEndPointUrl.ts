export function getUserApiUrl(userName: string) {
  return `/api/github/users/${userName}`;
}

export function getUserRepositoriesApiUrl(userName: string) {
  return `/api/github/users/${userName}/repos`;
}

export function getRepositoryApiUrl(ownerName: string, repositoryName: string) {
  return `/api/github/repos/${ownerName}/${repositoryName}`;
}

export function getRepositoryCommitsApiUrl(
  ownerName: string,
  repositoryName: string
) {
  return `/api/github/repos/${ownerName}/${repositoryName}/commits`;
}

export function getMemberApiUrl(orgName: string) {
  return `/api/github/orgs/${orgName}/members`;
}
