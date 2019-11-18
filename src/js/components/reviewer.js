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
    this.name = create.element('p', {
      classList: ['user-name'],
      textContent: this.reviewer.name,
    })
    const wrapper = super.html({
      tagName,
      classList,
      children: [...children, this.name],
    })
    return wrapper
  }
}
