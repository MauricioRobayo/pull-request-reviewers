import githubPR from './github-pr'

const validPrUrls = [
  {
    prUrl: 'https://github.com/user/repo/pull/1',
    apiEndpoint: 'https://api.github.com/repos/user/repo/pulls/1',
  },
  {
    prUrl: 'https://github.com/UserName/repo-1/pull/1',
    apiEndpoint: 'https://api.github.com/repos/UserName/repo-1/pulls/1',
  },
  {
    prUrl: 'https://github.com/user-name/Repo2/pull/1',
    apiEndpoint: 'https://api.github.com/repos/user-name/Repo2/pulls/1',
  },
  {
    prUrl: 'https://github.com/user_name/repo_3/pull/1',
    apiEndpoint: 'https://api.github.com/repos/user_name/repo_3/pulls/1',
  },
]

const invalidPrUrls = [
  { prUrl: 'http://github.com/user/repo/pull/1' },
  { prUrl: 'https://github.com/repo-1/pull/1' },
  { prUrl: 'https://github.com/user-name/Repo2/1' },
  { prUrl: 'https://example.com/user/repo/pull/1' },
]

describe('returns true for a valid GitHub url', () => {
  validPrUrls.forEach(({ prUrl }) => {
    test(`returns true for ${prUrl}`, () => {
      expect(githubPR.isValidPRUrl(prUrl)).toBe(true)
    })
  })
})

describe('returns false for an invalid GitHub url', () => {
  invalidPrUrls.forEach(({ prUrl }) => {
    test(`returns false for ${prUrl}`, () => {
      expect(githubPR.isValidPRUrl(prUrl)).toBe(false)
    })
  })
})

describe('returns the same url for a valid GitHub url', () => {
  validPrUrls.forEach(({ prUrl }) => {
    test(`returns the same url for ${prUrl}`, () => {
      expect(githubPR.validatePRUrl(prUrl)).toBe(prUrl)
    })
  })
})

describe('throws for an invalid GitHub url', () => {
  invalidPrUrls.forEach(({ prUrl }) => {
    test(`throws for ${prUrl}`, () => {
      expect(() => {
        githubPR.validatePRUrl(prUrl)
      }).toThrow('Not a valid GitHub Pull Request Url.')
    })
  })
})

describe('gets the API endpoint for a prUrl', () => {
  validPrUrls.forEach(({ prUrl, apiEndpoint }) => {
    test(`throws for ${prUrl}`, () => {
      expect(githubPR.prUrlToApiEndpoint(prUrl).href).toBe(apiEndpoint)
    })
  })
})
