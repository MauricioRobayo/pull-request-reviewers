import * as create from '../element-creator'
import User from './user'

export default class Reviewer extends User {
  constructor(reviewer) {
    super(reviewer)
    this.name = create.element('p', {
      classList: ['user-name'],
      textContent: this.reviewer.name,
    })
  }

  html({ tagName = 'div', classList = ['user'], children = [] }) {
    this.avatarLink = this.htmlUrl.cloneNode()
    this.avatarLink.append(this.avatar)
    this.avatarLink.classList.add('avatar-link')
    this.loginLink = this.htmlUrl.cloneNode()
    this.loginLink.append(this.login)
    this.loginLink.classList.add('login-link')
    const wrapper = create.element(tagName, {
      classList,
      children: [this.avatarLink, this.name, this.loginLink, ...children],
    })
    return wrapper
  }
}
