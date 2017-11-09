import Watcher from '../watcher'
import {joinExp} from '../utils'

export default class Complier {
  constructor (vm, el) {
    this.el = el
    this.vm = vm
    this.$scope = vm.$data
    const fragment = this.nodeToFragment(el)
    this.complie(fragment)
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
        this.complie(_node)
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
  }
  resolveDirective (name, exp, node) {
    if (name === 'text') {
      /* eslint-disable no-new */
      const args = exp.split('+')
      const _args = args.map(arg => {
        const regStr = /(^['"](.*?))|((.*?)['"]$)/ // 匹配字符串表达式 剩余的为真正的js代码片段
        if (regStr.test(arg)) {
          // 普通字符串
          return arg
        } else {
          return {
            js: 'this.$scope.' + arg.trim()
          }
        }
      })
      const _exp = joinExp(_args)
      new Watcher(this.vm, _exp, val => {
        console.log('update fn')
        node.textContent = val
      })
    }
  }
  complieText (node) {
    let textReg = /\{\{(.*?)\}\}/g  // 采用非贪婪模式
    if (!textReg.test(node.textContent)) {
      return
    }
    const texts = node.textContent.split(/(\{\{.*?\}\})/)
    let codes = []
    texts.forEach(text => {
      if (textReg.test(text)) {
        const exp = RegExp.$1.trim()
        const args = exp.split('+')
        codes = codes.concat(args.map(arg => {
          const regStr = /(^['"](.*?))|((.*?)['"]$)/ // 匹配字符串表达式 剩余的为真正的js代码片段
          if (regStr.test(arg)) {
            // 普通字符串
            return arg
          } else {
            return {
              js: 'this.$scope.' + arg.trim()
            }
          }
        }))
      } else {
        codes.push(text)
      }
    })
    const _exp = joinExp(codes)
    new Watcher(this.vm, _exp, val => {
      node.textContent = val
    })
  }
}
