import Dep from './dep'

export default class Watcher {
  constructor (vm, exp, fn) {
    console.log('跑了', exp)
    this.vm = vm
    this.exp = exp
    this.fn = fn
    /* eslint-disable no-new-func */
    this.execFunc = new Function('return ' + this.exp)
    console.log(this.execFunc, exp)
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
    const value = this.execFunc()
    console.log(value)
    this.value = value // 这里触发getter 如果此时的Dep.target不为空 便往dep上添加订阅
    return value
  }
}
