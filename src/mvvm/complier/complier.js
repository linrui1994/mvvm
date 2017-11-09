import Watcher from '../watcher'

export default class Complier {
  constructor (vm, el) {
    this.el = el
    this.vm = vm
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
        // arg = arg.trim()
        const regStr = /(^['"](.*?))|((.*?)['"]$)/ // 匹配字符串表达式 剩余的为真正的js代码片段
        if (regStr.test(arg)) {
          // 普通字符串
          return arg
        } else {
          return 'this.vm.$data.' + arg.trim()
        }
      })
      new Watcher(this.vm, _args.join('+'), val => {
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
    let _exp = ''
    texts.forEach(text => {
      if (textReg.test(text)) {
        const exp = RegExp.$1.trim()
        const args = exp.split('+')
        const _args = args.map(arg => {
          // arg = arg.trim()
          const regStr = /(^['"](.*?))|((.*?)['"]$)/ // 匹配字符串表达式 剩余的为真正的js代码片段
          if (regStr.test(arg)) {
            // 普通字符串
            return arg
          } else {
            return 'this.vm.$data.' + arg
          }
        })
        if (_exp) {
          _exp += '+'
        }
        _exp += _args.join('+')
      } else {
        if (_exp) {
          _exp += '+'
        }
        _exp += ('"' + text + '"')
      }
    })
    new Watcher(this.vm, _exp, val => {
      node.textContent = val
    })
  }
}
