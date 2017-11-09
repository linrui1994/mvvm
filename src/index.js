import MVVM from './mvvm'

const vm = new MVVM({
  el: '#mvvm',
  data: {
    user: {
      account: {
        username: 123,
        password: 234
      },
      name: 'lin',
      age: 22
    }
  }
})

window.vm = vm
