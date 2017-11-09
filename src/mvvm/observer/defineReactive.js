import Dep from '../watcher/dep'

export function defineReactive (obj, key, val) {
  const dep = new Dep()
  console.log(key)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: false, // 不可以被多次define
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
      // 在重新赋值为对象时需要重新设置getter和setter
      if (typeof val === 'object') {
        Object.keys(val).forEach(key => {
          defineReactive(val, key, val[key])
        })
      }
      val = newval
      console.log(newval, 'update')
      dep.notify()
    }
  })
}
