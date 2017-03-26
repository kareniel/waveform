const html = require('choo/html')
const trackEl = require('./track.el')
const arranger = require('./arranger.el')
const segmentLibrary = require('./segment-library.el')
const waveformEditor = require('./waveform-editor.el')

module.exports = function layout (state, emit) {
  return html`
    <body onclick=${onClick}>
      <nav id="nav-bar">
        <div></div>
        <div>
          <h1>mix editor</h1>
        </div>
        <div></div>
      </nav>

      <div id="top-half">
        <nav id="arranger-menu">
          <div>
            <label>mix length: </label>
            <input type="number" min="0" value=${state.mixLength} step="4">
            <span>bars</span>
          </div>
        </nav>
        ${arranger(state, emit)}
      </div>

      <div class="horizontal-separator"></div>

      <div id="bottom-half">
        ${segmentLibrary(state, emit)}
        <div class="vertical-separator"></div>
        ${waveformEditor(state, emit)}
      </div>
    </body>
  `

  function onClick (e) {
    const target = document.elementFromPoint(e.x, e.y)
    const classes = [...target.classList]
    
    if (!classes.includes('is-grabbable')) {
      // deselect grabbable elements
      emit('deselect-segments')
    }
  }
}