const Waveform = require('./Waveform.js')
const waveform = new Waveform('/data/cosmicosmo-twoson.mp3')

document.body.appendChild(waveform.el)
waveform.render()