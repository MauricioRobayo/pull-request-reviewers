import * as create from '../element-creator'

export default class User {
  constructor(user) {
    this.reviewer = user
    this.buildBasicElements()
  }

  buildBasicElements() {
    this.login = create.element('p', {
      classList: ['user-login'],
      textContent: this.reviewer.login,
    })
    this.htmlUrl = create.element('a', {
      href: this.reviewer.html_url,
    })
    this.avatar = this.avatar()
  }

  avatar({ size = 64 } = {}) {
    return create.element('img', {
      src: `${this.reviewer.avatar_url}&s=${size}`,
    })
  }

  html({ tagName = 'div', classList = ['user'], children = [] }) {
    this.htmlUrl.append(this.avatar, this.login)
    const wrapper = create.element(tagName, {
      classList,
      children: [this.htmlUrl, ...children],
    })
    return wrapper
  }
}
