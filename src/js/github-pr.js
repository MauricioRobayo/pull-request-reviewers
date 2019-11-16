const apiUrl = 'https://api.github.com'

export default class GitHubPR {
  constructor(prUrl) {
    GitHubPR.validatePRUrl(prUrl)
    this.prUrl = new URL(prUrl)
    this.prApiUrl = GitHubPR.prUrlToApiEndpoint(prUrl)
  }

  static validatePRUrl(prUrl) {
    if (!GitHubPR.isValidPRUrl(prUrl)) {
      throw new Error('Not a valid GitHub Pull Request Url.')
    }
    return prUrl
  }

  static isValidPRUrl(prUrl) {
    const githubPullRequestPattern = RegExp(
      /^https:\/\/github.com\/[\w-_.+]+\/[\w-_.+]+\/pull\/\d+\/?$/
    )
    return githubPullRequestPattern.test(prUrl)
  }

  static prUrlToApiEndpoint(prUrl) {
    GitHubPR.validatePRUrl(prUrl)
    const { pathname } = new URL(prUrl)
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
    return (await fetch(url, apiOptions)).json()
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
