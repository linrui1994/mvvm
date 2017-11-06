import Dep from './dep'

export default class Watcher {
  constructor (vm, exp, fn) {
    console.log('跑了', exp)
    this.vm = vm
    this.exp = exp
    this.fn = fn
    Dep.target = this // 在Dep的静态变量上绑定wather
    this.update()
    Dep.target = null
  }
  update () {
    const value = this.get()
    console.log('update')
    this.fn && this.fn(value)
  }
  get () {
    const keys = this.exp.split('.')
    let value = this.vm.$data
    for (let key in keys) {
      value = value[keys[key]]
    }
    this.value = value // 这里触发getter 从而往dep上添加订阅
    return value
  }
}
