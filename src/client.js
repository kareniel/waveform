const choo = require('choo')
const html = require('bel')

const app = choo()

app.use(store)
app.route('/', layout)

app.mount('body')

function layout (state, emit) {
  const bars = 96
  const barWidth = 12
  const fullWidth = bars * barWidth

  return html`
    <body>

      <nav>
        <label>length: </label>
        <input type="number" min="0" value=${bars} step="4">
        <span>bars</span>
      </nav>

      <div id="top-half">
        <section id="timeline">

          <div class="rail" style="min-width: ${fullWidth}px;">
            <div class="segment-block" style="left: 240px">
            </div>
          </div>

          <br>

          <div class="rail" style="min-width: ${fullWidth}px;">
            <div class="segment-block" style="left: 480px">
            </div>
          </div>

        </section>
      </div>

      <div id="bottom-half">
        <div id="segment-browser">
          <p>segments</p>
        </div>

        <section id="waveform-editor">
          <p>selected waveform</p>
        </section>
      </div>
    </body>
  `
}

function store (state, emitter) {
  emitter.on('DOMContentLoaded', function () {
    // wf.render()
  })
}
