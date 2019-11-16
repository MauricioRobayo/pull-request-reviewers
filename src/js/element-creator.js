const setProperty = (element, key, value) => {
  switch (key) {
    case 'classList':
      element.classList.add(...value)
      break
    case 'dataset':
      Object.keys(value).forEach(data => {
        element.setAttribute(`data-${data}`, value[data])
      })
      break
    case 'children':
      element.append(...value)
      break
    default:
      element[key] = value
  }
}
const element = (type = 'div', properties = {}) => {
  const e = document.createElement(type)
  Object.entries(properties).forEach(([key, value]) => {
    setProperty(e, key, value)
  })
  return e
}

export { element, setProperty }
