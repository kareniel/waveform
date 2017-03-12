const yo = require('yo-yo')
const Waveform = require('./Waveform.js')

const waveform = new Waveform('/data/cosmicosmo-twoson.mp3')

document.body.appendChild(waveform.canvas)
document.body.appendChild(waveform.playButton)
document.body.appendChild(waveform.loopingButton)

waveform.render()