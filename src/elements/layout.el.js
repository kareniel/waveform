const html = require('choo/html')
const trackEl = require('./track.el')
const segmentLibrary = require('./segment-library.el')
const waveformEditor = require('./waveform-editor.el')

module.exports = function layout (state, emit) {
  const bars = 80
  const tracks = [
    [{
      id: 0,
      length: 16,         // in bars
      color: 'blue',
      x: 0                // in bars
    }, , {
      id: 2,
      length: 8,
      color: 'green',
      x: 48
    }], [{
      id: 1,
      length: 4,
      color: 'orange',
      x: 32

    },{
      id: 3,
      length: 2,
      color: 'purple',
      x: 64
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
        ${segmentLibrary(state, emit)}
        ${waveformEditor(state, emit)}
      </div>
    </body>
  `
}