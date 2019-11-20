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

  wrapWithLink(element, classSuffix = 'link') {
    const link = this.htmlUrl.cloneNode()
    link.append(element)
    link.classList.add(`${element.classList[0]}-${classSuffix}`)
    return link
  }

  html({ tagName = 'div', classList = ['user'], children = [] }) {
    const avatarLink = this.wrapWithLink(this.avatar)
    const loginLink = this.wrapWithLink(this.login)
    const wrapper = create.element(tagName, {
      classList,
      children: [avatarLink, this.name, loginLink, ...children],
    })
    return wrapper
  }
}
