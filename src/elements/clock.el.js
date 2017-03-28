const html = require('choo/html')

module.exports = function clock (ctx, emit) {
  const el = html`
    <div id="timer"></div>
  `

  render()

  return el

  function render () {
    el.innerHTML = ctx.currentTime.toFixed(2)
    requestAnimationFrame(render)
  }
}
