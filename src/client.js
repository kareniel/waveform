// const yo = require('yo-yo')


window.addEventListener('load', function (e) {
  const ctx = new AudioContext
  let source = ctx.createBufferSource()

  fetch('/data/cosmicosmo-twoson.mp3')
    .then(res => res.arrayBuffer())
    .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      const leftChannel = audioBuffer.getChannelData(0)
      const valuesPerPixel = Math.ceil(leftChannel.length/500)

      const values = leftChannel.filter((el, i) => {
        return valuesPerPixel % i === 0
      })

      source.buffer = audioBuffer
      source.connect(ctx.destination)
      // source.start(0)
    })
})

// 