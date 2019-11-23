import * as create from '../element-creator'
import Info from './info'

export default class PRInfo extends Info {
  constructor({ title, url, state }) {
    super({ title, url })
    this.icon = create.element('span', {
      classList: ['icon'],
      innerHTML:
        '<svg width="12" height="16" aria-hidden="true"><use href="#github-pr"></use></svg>',
    })
    this.state = create.element('div', {
      textContent: state,
      classList: ['pr-state', state],
    })
  }

  render({ parent }) {
    parent.append(this.title, this.state)
  }

  html() {
    const wrapper = create.element('div', {
      classList: ['pr-info'],
      children: [this.icon, this.title, this.state],
    })
    return wrapper
  }
}
