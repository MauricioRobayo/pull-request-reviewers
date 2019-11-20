import './style.scss'
import GitHubPR from './js/github-pr'
import Reviewer from './js/components/reviewer'
import PRInfo from './js/components/pr-info'
import RepoInfo from './js/components/repo-info'
import * as create from './js/element-creator'

function buildPRInfoHTML(info) {
  const prInfo = new PRInfo({
    title: info.title,
    url: info.html_url,
    state: info.state,
  })
  return prInfo.html({
    parent: document.querySelector('#content'),
    classList: ['repo-info'],
  })
}

function buildRepoInfoHTML(info) {
  const repoInfo = new RepoInfo({
    title: info.base.repo.full_name,
    url: info.base.repo.html_url,
  })
  return repoInfo.html({
    parent: document.querySelector('#content'),
    classList: ['repo-info'],
  })
}

function buildReviewersHTML(reviewers) {
  return create.element('ul', {
    id: 'reviewers',
    classList: ['reviewers'],
    children: reviewers.map(reviewer =>
      new Reviewer(reviewer).html({ tagName: 'li' })
    ),
  })
}

function buildInfoHTML(info) {
  const repoInfoHTML = buildRepoInfoHTML(info)
  const prInfoHTML = buildPRInfoHTML(info)
  return create.element('section', {
    id: 'info',
    children: [repoInfoHTML, prInfoHTML],
  })
}

function preRender() {
  const infoContainers = document.querySelector('#info')
  const reviewersContainer = document.querySelector('#reviewers')
  if (infoContainers) {
    infoContainers.remove()
  }
  if (reviewersContainer) {
    reviewersContainer.remove()
  }
  document.querySelector('#error-msgs').innerHTML = ''
  document.querySelector('#pull-request-form').style.height = '270px'
  document.querySelector('#loader-container').classList.remove('hide')
}

function postRender() {
  document.querySelector('#loader-container').classList.add('hide')
}

function renderError(error) {
  const errorMsg = create.element('div', {
    classList: ['error-msg'],
    textContent: error,
  })
  document.querySelector('#error-msgs').append(errorMsg)
}

function renderInfo({ info, reviewers }) {
  const infoHTML = buildInfoHTML(info)
  const reviewersHTML = buildReviewersHTML(reviewers)
  document.querySelector('main').append(infoHTML, reviewersHTML)
}

async function fetchPR(prUrl) {
  const pr = new GitHubPR(prUrl)
  return Promise.all([pr.fetchInfo(), pr.fetchReviewers()])
}

async function render(prUrl) {
  preRender()
  try {
    const prInfo = await fetchPR(prUrl)
    renderInfo(prInfo)
  } catch (e) {
    renderError(e)
  }
  postRender()
}

async function onsubmit(event) {
  event.preventDefault()
  const prUrl = document.querySelector('#pull-request-url').value
  if (!GitHubPR.isValidPRUrl(prUrl)) {
    renderError('Not a valid GitHub Pull request url!')
    return
  }
  render(prUrl)
}

document
  .querySelector('#pull-request-form')
  .addEventListener('submit', onsubmit)
