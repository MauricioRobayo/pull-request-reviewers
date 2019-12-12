import githubPR from './github-pr'

const validPrUrls = [
  {
    prUrl: 'https://github.com/user/repo/pull/1/files',
    expectedUrl: 'https://github.com/user/repo/pull/1',
    apiEndpoint: 'https://api.github.com/repos/user/repo/pulls/1',
  },
  {
    prUrl: 'https://github.com/UserName/repo-1/pull/1#issue-350061414',
    expectedUrl: 'https://github.com/UserName/repo-1/pull/1',
    apiEndpoint: 'https://api.github.com/repos/UserName/repo-1/pulls/1',
  },
  {
    prUrl: 'https://github.com/user-name/Repo2/pull/1',
    expectedUrl: 'https://github.com/user-name/Repo2/pull/1',
    apiEndpoint: 'https://api.github.com/repos/user-name/Repo2/pulls/1',
  },
  {
    prUrl: 'https://github.com/user_name/repo_3/pull/1',
    expectedUrl: 'https://github.com/user_name/repo_3/pull/1',
    apiEndpoint: 'https://api.github.com/repos/user_name/repo_3/pulls/1',
  },
]

const invalidPrUrls = [
  { prUrl: 'http://github.com/user/repo/pull/1' },
  { prUrl: 'https://github.com/repo-1/pull/1' },
  { prUrl: 'https://github.com/user-name/Repo2/1' },
  { prUrl: 'https://example.com/user/repo/pull/1' },
]

describe('returns an empty string for an invalid GitHub url', () => {
  invalidPrUrls.forEach(({ prUrl }) => {
    test(`returns false for ${prUrl}`, () => {
      expect(githubPR.validatePRUrl(prUrl)).toBe('')
    })
  })
})

describe('returns the pr url for a valid GitHub url', () => {
  validPrUrls.forEach(({ prUrl, expectedUrl }) => {
    test(`returns the pr pr url for ${prUrl}`, () => {
      expect(githubPR.validatePRUrl(prUrl)).toBe(expectedUrl)
    })
  })
})

describe('returns an empty string for an invalid GitHub url', () => {
  invalidPrUrls.forEach(({ prUrl }) => {
    test(`returns an empty string for ${prUrl}`, () => {
      expect(githubPR.validatePRUrl(prUrl)).toBe('')
    })
  })
})

describe('gets the API endpoint for a prUrl', () => {
  validPrUrls.forEach(({ prUrl, apiEndpoint }) => {
    test(`returns the PR API endpoint for ${prUrl}`, () => {
      expect(githubPR.prUrlToApiEndpoint(prUrl).href).toBe(apiEndpoint)
    })
  })
})
