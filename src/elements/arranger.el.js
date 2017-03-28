const html = require('choo/html')
const trackEl = require('./track.el')
const clockEl = require('./clock.el')

module.exports = function arranger (state, emit) {

  return html`
    <section id="arranger">
      <nav id="arranger-menu">
        <div>
          <label>mix length: </label>
          <input type="number" min="0" value=${state.mixLength} step="4">
          <span>bars</span>
        </div>
        <div>
          <button>►</button>
        </div>
        <div>
          ${clockEl(state.audioCtx, emit)}
        </div>
        <div></div>
        <div></div>
        <div></div>
      </nav>
      <div id="arranger-tracks">
      ${state.tracks.map(track => {
        return trackEl(track, state.selectedTrackSegment, emit)
      })}
      </div>
    </section>
  `
}
