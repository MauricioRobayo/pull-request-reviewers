import * as create from '../element-creator'

export default class Info {
  constructor({ title, url }) {
    this.title = title
    this.url = url
    this.buildBasicElements()
  }

  buildBasicElements() {
    this.h2 = create.element('h2', {
      textContent: this.title,
      classList: ['info-title'],
    })
    this.title = create.element('a', {
      href: this.url,
      children: [this.h2],
    })
  }

  render({ parent, tagName = 'div', classList = ['info'] }) {
    const wrapper = this.html({ tagName, classList })
    parent.append(wrapper)
  }

  html({ tagName = 'div', classList = ['info'] }) {
    const wrapper = create.element(tagName, {
      classList,
      children: [this.title],
    })
    return wrapper
  }
}
