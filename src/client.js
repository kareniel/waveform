const yo = require('yo-yo')

const width = 500
const height = 120

const el = yo`<canvas width=${width} height=${height}></canvas>`
const canvasCtx = el.getContext('2d')
canvasCtx.clearRect(0, 0, 500, 120)

document.body.appendChild(el)

window.addEventListener('load', function (e) {
  const audioCtx = new AudioContext
  const analyser = audioCtx.createAnalyser() 

  fetch('/data/cosmicosmo-twoson.mp3')
    .then(res => res.arrayBuffer())
    .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      const source = audioCtx.createBufferSource()
      source.buffer = audioBuffer
      source.connect(analyser)
      analyser.connect(audioCtx.destination)
      source.start(0)

      const bufferLength = analyser.fftSize
      const dataArray = new Uint8Array(bufferLength)

      function draw () {
        requestAnimationFrame(draw)
        
        analyser.getByteTimeDomainData(dataArray)

        canvasCtx.fillStyle = 'rgb(150, 150, 150)'
        canvasCtx.fillRect(0, 0, 500, 120)
        canvasCtx.lineWidth = 2
        canvasCtx.strokeStyle = 'blue'
        canvasCtx.beginPath()

        let x = 0, y = height/2, val = 0

        const sliceWidth = width * 1.0 / bufferLength

        canvasCtx.moveTo(x, y)
        dataArray.forEach((item, i) => {
          val = item/128
          y = val * height/2
          canvasCtx.lineTo(x, y)
          x += sliceWidth
        })
        canvasCtx.lineTo(width, height / 2)
        canvasCtx.stroke()
      }

      draw()

    })
})

// 