import { defineReactive } from './defineReactive'

export default class Observer {
  constructor (data) {
    this.observe(data)
  }
  observe (data) {
    if (typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object') {
        this.observe(data[key])
      } else {
        defineReactive(data, key, data[key])
      }
    })
  }
}
