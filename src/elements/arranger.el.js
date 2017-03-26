const html = require('choo/html')
const trackEl = require('./track.el')

module.exports = function arranger (state, emit) {
  return html`
    <section id="arranger">
      ${state.tracks.map(track => {
        return trackEl(track, state.selectedTrackSegment, emit)
      })}
    </section>
  `

}
