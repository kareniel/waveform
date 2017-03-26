const html = require('choo/html')
const trackEl = require('./track.el')

module.exports = function timelineEditor (state, emit) {
  return html`
    <section id="timeline">
      ${state.tracks.map(track => {
        return trackEl(track, state.selectedTrackSegment, emit)
      })}
    </section>
  `

}
