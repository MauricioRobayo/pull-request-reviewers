import './style.scss'

function createElement(type, options = {}) {
  const element = document.createElement(type)
  Object.keys(options).forEach(option => {
    element[option] = options[option]
  })
  return element
}

function createUser(user) {
  const userHtml = {
    avatarUrl: createElement('img', {
      src: user.avatar_url,
    }),
    login: createElement('a', {
      href: user.html_url,
      textContent: user.login,
    }),
  }
  if (user.name) {
    const name = createElement('div', {
      textContent: user.name,
    })
    userHtml.name = name
    userHtml.name.classList.add('name')
  }
  userHtml.avatarUrl.classList.add('avatar')
  userHtml.login.classList.add('login')
  return userHtml
}

function renderPullRequestInfo(pullRequest) {
  const { login } = createUser(pullRequest.user)
  // const body = createElement('p', {
  //   id: 'body',
  //   textContent: pullRequest.body,
  // })
  // const createdAt = createElement('div', {
  //   id: 'created-at',
  //   textContent: pullRequest.created_at,
  // })
  // const updatedAt = createElement('div', {
  //   id: 'updated-at',
  //   textContent: pullRequest.updated_at,
  // })
  const title = createElement('a', {
    id: 'title',
    href: pullRequest.html_url,
    textContent: pullRequest.title,
  })
  document.querySelector('#pull-request-info').append(title, login)
}

function renderUsers(users) {
  const fragment = document.createDocumentFragment()
  const title = document.createElement('h3')
  if (users.length === 0) {
    title.textContent = 'No reviewers found :(.'
  } else {
    title.textContent = 'Reviewers:'
    users.forEach(user => {
      if (user.name) {
        const li = createElement('li')
        const { avatarUrl, login, name } = createUser(user)
        li.append(avatarUrl, login, name)
        fragment.appendChild(li)
      }
    })
    const ul = document.querySelector('#user-list')
    ul.before(title)
    ul.appendChild(fragment)
  }
}

async function fetchGithubApi(endpoint) {
  const githubApiUrl = 'https://api.github.com'
  const response = await fetch(
    endpoint.startsWith(githubApiUrl) ? endpoint : `${githubApiUrl}${endpoint}`,
    {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }
  )
  const data = await response.json()
  return data
}

async function getPullRequestData(event) {
  event.preventDefault()
  document.querySelector('#pull-request-url-messages').textContent = ''
  document.querySelector('#user-list').innerHTML = ''
  document.querySelector('#pull-request-info').innerHTML = ''
  document.querySelector('#loader').classList.remove('hide')
  try {
    const pullRequestUrl = new URL(
      document.querySelector('#pull-request-url').value
    )
    const pullRequestPath = `/repos${pullRequestUrl.pathname.replace(
      /\/pull\//,
      '/pulls/'
    )}`
    const pullRequest = await fetchGithubApi(pullRequestPath)
    renderPullRequestInfo(pullRequest)
    if (pullRequest.state === 'open') {
      const comments = await fetchGithubApi(pullRequest.review_comments_url)
      const uniqueUsersUrls = [
        ...new Set(
          comments
            .filter(comment => comment.user.login !== pullRequest.user.login)
            .map(comment => comment.user.url)
        ),
      ]
      const users = await Promise.all(
        uniqueUsersUrls.map(uniqueUserUrl => fetchGithubApi(uniqueUserUrl))
      )
      renderUsers(users)
      document.querySelector('#loader').classList.add('hide')
    } else {
      document.querySelector('#pull-request-url-messages').textContent =
        'The pull request is already closed!'
    }
  } catch (e) {
    document.querySelector('#loader').classList.add('hide')
    document.querySelector('#pull-request-url-messages').textContent = e
  }
}

document
  .querySelector('#pull-request-form')
  .addEventListener('submit', getPullRequestData)
