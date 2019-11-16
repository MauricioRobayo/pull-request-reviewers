import './style.scss'
import GitHubPR from './js/github-pr'

async function onsubmit(event) {
  event.preventDefault()
  const prUrl = document.querySelector('#pull-request-url').value
  const pr = new GitHubPR(prUrl)
  const [info, reviewers] = await Promise.all([
    pr.fetchInfo(),
    pr.fetchReviewers(),
  ])
  // eslint-disable-next-line no-console
  console.log(info, reviewers)
}

document
  .querySelector('#pull-request-form')
  .addEventListener('submit', onsubmit)
