import { Observer } from './Observer'
import { Complier } from './complier'

export default function mvvm (options) {
  this.$options = options
  this.$data = options.data
  this.$el = options.el
  console.log(this.$el)
  /* eslint-disable no-new */
  new Observer(this.$data)
  new Complier(this, this.$el)
}
