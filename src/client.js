const choo = require('choo')
const html = require('choo/html')

const app = choo()

app.use(store)
app.route('/', require('./layout.el'))
app.mount('body')

function store (state, emitter) {
  emitter.on('DOMContentLoaded', function () {

  })
}
