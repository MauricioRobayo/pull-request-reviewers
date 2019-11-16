import * as create from './element-creator'

export default class Reviewer {
  constructor(reviewer) {
    this.reviewer = reviewer
    this.buildBasicElements()
  }

  buildBasicElements() {
    this.avatar = create.element('img', {
      src: this.reviewer.avatar_url,
    })
    this.name = create.element('p', {
      classList: ['reviewer-name'],
      textContent: this.reviewer.name,
    })
    this.login = create.element('p', {
      classList: ['reviewer-login'],
      textContent: this.reviewer.login,
    })
    this.htmlUrl = create.element('a', {
      href: this.reviewer.html_url,
    })
  }

  render({ parent, tagName = 'div', classList = ['reviewer'] }) {
    const avatar = this.htmlUrl.cloneNode()
    avatar.append(this.avatar)
    const login = this.htmlUrl.cloneNode()
    login.append(this.login)
    const wrapper = create.element(tagName, {
      classList,
      children: [avatar, login, this.name],
    })
    parent.append(wrapper)
  }
}
