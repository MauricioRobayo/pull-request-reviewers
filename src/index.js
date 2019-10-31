import './style.scss'
import githubFetch from './js/github-fetch'

const $ = document.querySelector.bind(document)

function createElement(type = 'div', properties = {}, children = []) {
  const element = document.createElement(type)
  Object.keys(properties).forEach(property => {
    switch (property) {
      case 'classList':
        element.classList.add(...properties[property])
        break
      case 'dataset':
        Object.keys(properties[property]).forEach(data => {
          element.setAttribute(`data-${data}`, properties[property][data])
        })
        break
      default:
        element[property] = properties[property]
    }
  })
  element.append(...children)
  return element
}

function renderUser(user) {
  const avatarUrl = createElement('img', {
    src: user.avatar_url,
    classList: ['avatar'],
  })
  const login = createElement('a', {
    href: user.html_url,
    textContent: user.login,
    classList: ['login'],
  })
  const name = createElement('div', {
    textContent: user.name,
    classList: ['name'],
  })
  const userContainer = createElement(
    'div',
    {
      classList: ['user-container'],
    },
    [avatarUrl, name, login]
  )
  return userContainer
}

function renderPullRequestInfo(pullRequest) {
  const user = renderUser(pullRequest.user)
  const title = createElement('a', {
    id: 'title',
    href: pullRequest.html_url,
    textContent: pullRequest.title,
  })
  $('#pull-request-info').append(title, user)
}

function renderUsers(users) {
  const ul = $('#user-list')
  const title = document.createElement('h3', {
    textContent: users.length ? 'Reviewers:' : 'No reviewers found :(.',
  })
  ul.before(title)
  const userHTML = users.map(renderUser)
  ul.append(...userHTML)
}

function validatePullRequestUrl(pullRequestUrl) {
  const githubPullRequestPattern = RegExp(
    /^https:\/\/github.com\/[\w-_.+]+\/[\w-_.+]+\/pull\/\d+\/?$/
  )
  return githubPullRequestPattern.test(pullRequestUrl)
}

function renderError(message) {
  $('#loader-container').classList.add('hide')
  $('#pull-request-url-messages').textContent = message
}

function usersFromComments(comments, excludedLogins) {
  return [
    ...new Set(
      comments
        .flat()
        .filter(comment => !excludedLogins.includes(comment.user.login))
        .map(comment => comment.user.url)
    ),
  ]
}

function prepareOutput() {
  $('#pull-request-url-messages').textContent = ''
  $('#user-list').innerHTML = ''
  $('#pull-request-info').innerHTML = ''
  $('#loader-container').classList.remove('hide')
}

async function onsubmit(event) {
  event.preventDefault()
  prepareOutput()
  const pullRequestUrl = $('#pull-request-url').value

  if (!validatePullRequestUrl(pullRequestUrl)) {
    renderError(
      "That's not a valid url pull request URL. Please provide a valid pull request URL."
    )
    return
  }

  try {
    const pullRequestUrlObject = new URL(pullRequestUrl)
    const pullRequestPath = `/repos${pullRequestUrlObject.pathname.replace(
      /\/pull\//,
      '/pulls/'
    )}`
    const pullRequest = await githubFetch(pullRequestPath)
    renderPullRequestInfo(pullRequest)
    const allComments = await Promise.all([
      githubFetch(pullRequest.review_comments_url),
      githubFetch(pullRequest.comments_url),
    ])

    const uniqueUsersUrls = usersFromComments(allComments, [
      pullRequest.user.login,
    ])

    const users = await Promise.all(
      uniqueUsersUrls.map(uniqueUserUrl => githubFetch(uniqueUserUrl))
    )
    renderUsers(users)
    $('#loader-container').classList.add('hide')
  } catch (e) {
    renderError(e)
  }
}

document
  .querySelector('#pull-request-form')
  .addEventListener('submit', onsubmit)
