const html = require('choo/html')
// const widget = require('cache-element/widget')
const trackEl = require('./track.el')




module.exports = function timelineEditor (state, emit) {
  return html`
    <section id="timeline">
      ${state.tracks.map(track => trackEl(track, emit))}
    </section>
  `         
}
