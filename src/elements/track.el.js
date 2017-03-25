const html = require('choo/html')
const trackGridEl = require('./track-grid.el')
const dragIcon = html`<img src="#">`

const bars = 80
const barWidth = 12
const fullWidth = bars * barWidth
const gridWidth = barWidth

let selectedEl, distance, rect, blockWidth, offsetX, max, newPos

const bodyEl = document.getElementsByTagName('body')[0]

function style (block) {
  return `
    background-color: ${block.color};
    width: ${block.length * barWidth}px; 
    left: ${block.x * barWidth}px;
  `
}

module.exports = function trackEl(track, emit) {
  return html`
    <div class="track" style="min-width: ${fullWidth}px;">
      ${trackGridEl({fullWidth, gridWidth})}
      ${track.map(block => html`    
        <div 
          class="segment-block is-grabbable" 
          onmousedown=${onMouseDown} 
          style=${style(block)}>
        </div>`
      )}
    </div>
  `

  function onMouseDown (e) {
    // keep track of the distance between mouse and left side of block
    selectedEl = e.target
    offsetX = selectedEl.parentNode.getBoundingClientRect().left
    distance = Math.abs(e.x - selectedEl.offsetLeft - offsetX)

    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', function onMouseUp (e) {
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onMouseUp)
    })
  }


  function onDrag (e) {
    e.preventDefault()

    rect = selectedEl.getBoundingClientRect()
    blockWidth = rect.right - rect.left
    max = fullWidth - blockWidth
    newPos = (e.x - offsetX - distance)

    // snap to grid
    newPos = snapToGrid(newPos)

    // min
    if (newPos <= 0) {
      newPos = 0
    }

    // max
    if (newPos >= max) {
      newPos = max
    }

    selectedEl.style.left = newPos + 'px'

    return false
  }

  function snapToGrid (x) {
    return x - (x % 12)
  }
}




