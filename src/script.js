const el = document.getElementById('audio')

const ctx = new AudioContext
const analyser = ctx.createAnalyser()
const source = ctx.createMediaElementSource(el)

source.connect(analyser)
analyser.connect(ctx.destination)