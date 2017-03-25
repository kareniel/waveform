const html = require('choo/html')

module.exports = function waveformEditor (state, emit) {
  const {selectedTrackSegment, selectedSegment} = state

  if (selectedTrackSegment) {
    return html`
      <div id="waveform-editor">
        <h3></h3>
        <p>length: ${selectedTrackSegment.length}</p>
        <pre style="text-align: left;">
          ${JSON.stringify(selectedTrackSegment, null, 2)}
        </pre>
      </div>
    `
  }

  if (selectedSegment) {
    return html`
    <div id="waveform-editor">
      <h3>${selectedSegment.title}</h3>
      <div class="waveform"></div>
    </div>
  `
  }


  return html`
    <div id="waveform-editor">
      <pre style="text-align: left;">
        ${JSON.stringify(state, null, 2)}
      </pre>
    </div>
  `
}