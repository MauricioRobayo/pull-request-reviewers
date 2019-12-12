const apiUrl = 'https://api.github.com'

export default class GitHubPR {
  constructor(prUrl) {
    this.prUrl = new URL(GitHubPR.validatePRUrl(prUrl))
    this.prApiUrl = GitHubPR.prUrlToApiEndpoint(prUrl)
  }

  static validatePRUrl(prUrl) {
    const re = /(^https:\/\/github\.com\/[\w\-_.+]+\/[\w\-_.+]+\/pull\/\d+).*$/
    const match = re.exec(prUrl)
    if (match) {
      return match[1]
    }
    return ''
  }

  static prUrlToApiEndpoint(prUrl) {
    const { pathname } = new URL(GitHubPR.validatePRUrl(prUrl))
    const prApiUrl = new URL(
      `/repos${pathname.replace('/pull/', '/pulls/')}`,
      apiUrl
    )
    return prApiUrl
  }

  static async fetch(endpoint) {
    const apiOptions = {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    }
    const url = endpoint.startsWith(apiUrl) ? endpoint : `${apiUrl}${endpoint}`
    const response = await fetch(url, apiOptions)
    const json = await response.json()
    if (!response.ok) {
      throw new Error(json.message)
    }
    return json
  }

  fetchInfo() {
    return GitHubPR.fetch(this.prApiUrl.pathname)
  }

  fetchReviews() {
    return GitHubPR.fetch(`${this.prApiUrl.pathname}/reviews`)
  }

  async fetchReviewers() {
    const reviews = await GitHubPR.fetch(`${this.prApiUrl.pathname}/reviews`)
    const uniqueReviewers = [...new Set(reviews.map(review => review.user.url))]
    return Promise.all(
      uniqueReviewers.map(reviewer => GitHubPR.fetch(reviewer))
    )
  }
}
