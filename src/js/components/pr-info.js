import * as create from '../element-creator'
import Info from './info'

export default class PRInfo extends Info {
  constructor({ title, url, state }) {
    super({ title, url })
    this.state = create.element('div', {
      textContent: state,
      classList: ['pr-state'],
    })
  }

  render({ parent }) {
    parent.append(this.title, this.state)
  }

  html() {
    const wrapper = create.element('div', {
      classList: ['pr-info'],
      children: [this.title, this.state],
    })
    return wrapper
  }
}
