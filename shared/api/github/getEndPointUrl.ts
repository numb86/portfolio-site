export function getUserApiUrl(userName: string) {
  return `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/github/users/${userName}`;
}

export function getUserRepositoriesApiUrl(userName: string) {
  return `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/github/users/${userName}/repos`;
}

export function getRepositoryApiUrl(ownerName: string, repositoryName: string) {
  return `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/github/repos/${ownerName}/${repositoryName}`;
}

export function getRepositoryCommitsApiUrl(
  ownerName: string,
  repositoryName: string
) {
  return `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/github/repos/${ownerName}/${repositoryName}/commits`;
}

export function getMemberApiUrl(orgName: string) {
  return `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/github/orgs/${orgName}/members`;
}
