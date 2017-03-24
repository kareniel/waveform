const html = require('choo/html')
const trackEl = require('./track.el')

module.exports = function layout (state, emit) {
  const bars = 80
  const tracks = [
    [{
      id: 0,
      length: 16,         // in bars
      color: 'blue',
      x: 0                // in bars
    }, {
      id: 1,
      length: 4,
      color: 'orange',
      x: 32

    }, {
      id: 2,
      length: 8,
      color: 'green',
      x: 48
    }]
  ]
  return html`
    <body>
      <nav>
        <label>length: </label>
        <input type="number" min="0" value=${bars} step="4">
        <span>bars</span>
      </nav>

      <div id="top-half">
        <section id="timeline">
          ${tracks.map(track => trackEl(track, emit))}
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