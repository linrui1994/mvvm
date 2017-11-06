import MVVM from './mvvm'

const vm = new MVVM({
  el: '#mvvm',
  data: {
    user: {
      name: 'lin',
      age: 22
    }
  }
})

window.vm = vm
