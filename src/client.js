const yo = require('yo-yo')
const Waveform = require('./Waveform.js')

const waveform = new Waveform(800, 120)

document.body.appendChild(waveform.canvas)

waveform.render()