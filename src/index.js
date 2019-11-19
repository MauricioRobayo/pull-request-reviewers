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
    classList: ['reviewers'],
    children: reviewers.map(reviewer =>
      new Reviewer(reviewer).html({ tagName: 'li' })
    ),
  })
}

async function fetchPR() {
  const pr = new GitHubPR(document.querySelector('#pull-request-url').value)
  return Promise.all([pr.fetchInfo(), pr.fetchReviewers()])
}

async function onsubmit(event) {
  event.preventDefault()
  event.target.style.height = '270px'
  const [info, reviewers] = await fetchPR()
  const repoInfoHTML = buildRepoInfoHTML(info)
  const prInfoHTML = buildPRInfoHTML(info)
  const reviewersHTML = buildReviewersHTML(reviewers)
  document.querySelector('#info').append(repoInfoHTML, prInfoHTML)
  document.querySelector('#reviewers').append(reviewersHTML)
}

document
  .querySelector('#pull-request-form')
  .addEventListener('submit', onsubmit)
