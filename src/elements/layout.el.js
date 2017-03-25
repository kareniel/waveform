const html = require('choo/html')
const trackEl = require('./track.el')
const timelineEditor = require('./timeline-editor.el')
const segmentLibrary = require('./segment-library.el')
const waveformEditor = require('./waveform-editor.el')

module.exports = function layout (state, emit) {
  const bars = 80
  return html`
    <body>
      <nav>
        <label>length: </label>
        <input type="number" min="0" value=${bars} step="4">
        <span>bars</span>
      </nav>

      <div id="top-half">
        ${timelineEditor(state, emit)}
      </div>

      <div id="bottom-half">
        ${segmentLibrary(state, emit)}
        ${waveformEditor(state, emit)}
      </div>
    </body>
  `
}