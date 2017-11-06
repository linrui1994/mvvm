import Watcher from '../watcher'

export default class Complier {
  constructor (vm, el) {
    this.el = el
    this.vm = vm
    const fragment = this.nodeToFragment(el)
    this.complie(fragment)
    console.log(this.el)
    document.querySelector(this.el).appendChild(fragment)
  }
  nodeToFragment (el) {
    let fragment = document.createDocumentFragment()
    let node = document.querySelector(el)
    let child
    /* eslint-disable no-cond-assign */
    while (child = node.firstChild) {
      fragment.append(child)
    }
    return fragment
  }
  complie (node) {
    const childNodes = node.childNodes || []
    Array.from(childNodes).forEach(_node => {
      if (_node.childNodes && _node.childNodes.length) {
        this.complie(_node.childNodes)
        this.complieElement(_node)
      } else {
        if (_node.nodeType === 1) {
          // 标签节点
          this.complieElement(_node)
        } else if (_node.nodeType === 3) {
          // text or attr
          this.complieText(_node)
        }
      }
    })
  }
  complieElement (node) {
    const attrs = node.attributes
    const directiveReg = /^v-(\w)+/
    attrs.length && Array.from(attrs).forEach(attr => {
      const {name} = attr
      if (directiveReg.test(name)) {
        const directiveName = name.slice(2)
        const exp = attr.nodeValue
        this.resolveDirective(directiveName, exp, node)
      }
    })
    const textContent = node.textContent
    const textReg = /\{\{(.*?)\}\}/
    if (textReg.test(textContent)) {
      this.complieText(node)
    }
  }
  resolveDirective (name, exp, node) {
    if (name === 'text') {
      /* eslint-disable no-new */
      new Watcher(this.vm, exp, val => {
        node.textContent = val
      })
    }
  }
  complieText (node) {
    let textReg = /\{\{(.*?)\}\}/  // 采用非贪婪模式
    if (textReg.test(node.textContent)) {
      let exp = RegExp.$1 // 获取匹配表达式
      exp = exp.trim()
      /* eslint-disable no-new */
      new Watcher(this.vm, exp, val => {
        console.log('pao', val)
        node.textContent = node.textContent.replace(textReg, val)
        textReg = new RegExp(val)
      })
    }
  }
}
