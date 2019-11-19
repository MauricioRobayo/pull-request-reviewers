import octicons from '@primer/octicons'
import * as create from '../element-creator'
import Info from './info'

export default class PRInfo extends Info {
  constructor({ title, url, state }) {
    super({ title, url })
    this.prIcon = create.element('span', {
      classList: ['icon'],
      innerHTML: octicons['git-pull-request'].toSVG(),
    })
    this.title.prepend(this.prIcon)
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
