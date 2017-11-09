import { Observer } from './Observer'
import { Complier } from './complier'

export default function mvvm (options) {
  this.$options = options
  this.$data = options.data
  this.$el = options.el
  console.log(this.$el)
  /* eslint-disable no-new */
  new Observer(this.$data)
  _proxy(this)
  new Complier(this, this.$el)
}

function _proxy (context) {
  Object.keys(context.$data).forEach(key => {
    Object.defineProperty(context, key, {
      configurable: true,
      enumerable: true,
      get: () => context.$data[key],
      set: newval => {
        if (context.$data[key] !== newval) {
          context.$data[key] = newval
        }
      }
    })
  })
}
