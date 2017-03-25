const html = require('choo/html')

module.exports = function waveformEditor (state, emit) {
  const {selectedSegment} = state

  if (!selectedSegment) {
    return html`
      <div id="waveform-editor">empty :(</div>
    `
  }

  return html`
    <div id="waveform-editor">
      <h3>${selectedSegment.title}</h3>
      <div class="waveform"></div>
    </div>
  `
}