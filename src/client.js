const choo = require('choo')
const html = require('bel')
const Waveform = require('./Waveform')

const wf = new Waveform('/data/cosmicosmo-twoson.mp3')

const app = choo()

app.use(store)
app.route('/', layout)

app.mount('body')

function layout (state, emit) {
  return html`
    <body>
      <nav>
        <h1>waveform</h1>
      </nav>
      <div></div>
      <section></section>
      <section></section>
      <section>${wf.el}</section>
    </body>
  `
}

function store (state, emitter) {
  emitter.on('DOMContentLoaded', function () {
    wf.render()
  })
}



// const Waveform = require('./Waveform')
// const waveform = new Waveform('/data/cosmicosmo-twoson.mp3')

// document.body.appendChild(waveform.el)
// waveform.render()

// const Radar = require('./Radar')
// const radar = new Radar()
// document.body.appendChild(radar.el)