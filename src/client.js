const choo = require('choo')
const html = require('choo/html')

const app = choo()

app.use(logger)
app.use(store)
app.route('/', require('./elements/layout.el'))
app.mount('body')


function logger (state, emitter) {
  emitter.on('*', function (messageName, data) {
    console.log('event', messageName, data)
  })
}

function store (state, emitter) {
  state.segments = [{
    id: 0,
    title: 'Pold & Baribal - Senses'
  }, {
    id: 1,
    title: 'HMU - Angel City'
  }, {
    id: 2,
    title: 'Jonny Ha$h - Circular Time'
  }]
  state.selectedSegment = null
  emitter.on('DOMContentLoaded', function () {
    emitter.on('editor:selectSegment', function (segment) {
      state.selectedSegment = segment
      console.log(state)
      emitter.emit('render')
    })
  })
}
