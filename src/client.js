const choo = require('choo')
const html = require('choo/html')

const app = choo()

app.use(logger)
app.use(require('./stores/arranger.store'))
app.use(require('./stores/library.store'))
app.use(require('./stores/editor.store'))
app.route('/', require('./elements/layout.el'))
app.mount('body')

function logger (state, emitter) {
  emitter.on('*', function (messageName, data) {
    if (messageName !== 'render') {
      console.info('event', messageName, data)
    }
  })
}
