const html = require('choo/html')

module.exports = function (state) {

  let el = html`
    <canvas class="track-grid" width=${state.fullWidth} height="120">
    </canvas>
  `

  let ctx = el.getContext('2d')

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
  for (let i = state.fullWidth; i -= state.gridWidth; i >= 0) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, 120)
    ctx.stroke()
  }

  return el
}
