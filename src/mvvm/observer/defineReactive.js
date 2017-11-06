import Dep from '../watcher/dep'

export function defineReactive (obj, key, val) {
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: false,
    get () {
      if (Dep.target) {
        console.log('添加？？')
        dep.addSub(Dep.target) // 当Dep的静态变量target不为空时 添加订阅
      }
      return val
    },
    set (newval) {
      if (val === newval) {
        return
      }
      val = newval
      console.log(newval, 'update')
      dep.notify()
    }
  })
}
