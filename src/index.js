import './style.scss'
import GitHubPR from './js/github-pr'

// const pr = new GitHubPR('https://github.com/oscarnava/fakebook/pull/6')
const pr = new GitHubPR('https://github.com/MauricioRobayo/weather-app/pull/1')

pr.fetchReviewers().then(response => response.map(console.log))
