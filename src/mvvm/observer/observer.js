import { defineReactive } from './defineReactive'
// import { arrayDefineReactive } from './arrayDefineReactive'

export default class Observer {
  constructor (data) {
    this.observe(data)
  }
  observe (data) {
    if (typeof data !== 'object') {
      return
    }
    typeof data === 'function' && (data = data())
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object') {
        if (Array.isArray(data[key])) {
          // 数组需要特殊处理

        } else {
          this.observe(data[key])
        }
      }
      defineReactive(data, key, data[key])
    })
  }
}
