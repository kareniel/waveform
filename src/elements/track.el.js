const html = require('choo/html')

const trackGridEl = require('./track-grid.el')
const dragIcon = html`<img src="#">`

const bars = 80
const barWidth = 12
const fullWidth = bars * barWidth
const gridWidth = barWidth


const bodyEl = document.getElementsByTagName('body')[0]

function style (trackSegment) {
  return `
    background-color: ${trackSegment.color};
    width: ${trackSegment.length * barWidth}px; 
    left: ${trackSegment.x * barWidth}px;
  `
}

module.exports = function trackEl(track, selectedTrackSegment, emit) {
  return html`
    <div data-id=${track.id} class="track" style="min-width: ${fullWidth}px;">
      ${trackGridEl({fullWidth, gridWidth}, emit)}
      ${track.segments.map(trackSegment => {
        const selected = trackSegment === selectedTrackSegment ? 'is-selected' : ''

        return html`    
          <div
            data-id=${trackSegment.id}
            class="segment-block is-grabbable ${selected}"
            onmousedown=${handleDrag}
            style=${style(trackSegment)}>
            ${trackSegment.title}
          </div>`
        }
      )}
    </div>
  `
  
  function handleDrag (e) {
    e.preventDefault()

    let trackSegmentId = e.target.dataset.id
    let trackId = e.target.parentNode.dataset.id

    emit('timeline:selectTrackSegment', {trackId, trackSegmentId})

    let selectedEl, distance, rect, blockWidth, offsetX, max, newPos
    
    document.addEventListener('mousemove', onDragStart)
    document.addEventListener('mouseup', onMouseUp)

    function onDragStart () {
      selectedEl = e.target
      offsetX = selectedEl.parentNode.getBoundingClientRect().left
      distance = Math.abs(e.x - selectedEl.offsetLeft - offsetX)
      document.removeEventListener('mousemove', onDragStart)
      document.addEventListener('mousemove', onDrag)
    }

    function onMouseUp (e) {
      e.preventDefault()
      document.removeEventListener('mousemove', onDragStart)
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', onMouseUp)

      if (selectedEl) {
        let trackEl = selectedEl.parentNode

        emit('timeline:moveSegment', {
          trackId: trackEl.dataset.id,
          trackSegmentId: e.target.dataset.id,
          x: (newPos / 12)
        })
      }

      selectedEl = null
      offsetX = null
      distance = null
      newPos = null
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
}




