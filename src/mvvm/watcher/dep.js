export default class Dep {
  constructor () {
    this.subs = []
  }
  addSub (sub) {
    this.subs.push(sub)
  }
  notify () {
    console.log(this.subs)
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

// 当前
Dep.target = null
