const GITHUB_API_URLL = 'https://api.github.com'

async function fetchGithubApi(endpoint) {
  const response = await fetch(
    endpoint.startsWith(GITHUB_API_URLL)
      ? endpoint
      : `${GITHUB_API_URLL}${endpoint}`,
    {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }
  )
  return response.json()
}

export default fetchGithubApi
