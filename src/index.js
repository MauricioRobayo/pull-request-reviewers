import './style.scss'
import GitHubPR from './js/github-pr'
import Reviewer from './js/reviewer'

async function onsubmit(event) {
  event.preventDefault()
  const prUrl = document.querySelector('#pull-request-url').value
  const pr = new GitHubPR(prUrl)
  const [info, reviewers] = await Promise.all([
    pr.fetchInfo(),
    pr.fetchReviewers(),
  ])
  const reviewersList = document.querySelector('#reviewers-list')
  reviewers.forEach(reviewer => {
    const r = new Reviewer(reviewer)
    r.render({ parent: reviewersList, tagName: 'li' })
  })
}

document
  .querySelector('#pull-request-form')
  .addEventListener('submit', onsubmit)
