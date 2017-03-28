const html = require('choo/html')

const barWidth = 12

function style (block) {
  return `
    background-color: ${block.color};
    width: ${block.length * barWidth}px; 
    left: ${block.x * barWidth}px;
  `
}

module.exports = function segmentLibrary (state, emit) {
  return html `
    <div id="segment-library">
      <ul>
        ${state.segments.map(segment => {
          const classes = ['segment-block', 'is-grabbable']

          if (state.selectedSegment === segment) {
            classes.push('is-selected')
          }

          return html`
            <li
              data-id=${segment.id}
              class="${classes.join(' ')}" 
              onmousedown=${handleDrag}
              style=${style(segment)}>
              ${segment.title}
            </li>
          `
        })}
      </ul>
    </div>
  `

  function handleDrag (e) {
    let selectedEl = e.target
    let delta = {x: 0, y: 0}
    let trackElements = [...document.getElementsByClassName('track')]
    let rect, elCopy, hoveredTrack
    
    emit('library:selectSegment', selectedEl.dataset.id)

    document.addEventListener('mousemove', onDragStart)
    document.addEventListener('mouseup', onDragEnd)

    function onDragStart (e) {
      e.preventDefault()

      elCopy = selectedEl.cloneNode(true)
      elCopy.style.position = 'absolute'
      elCopy.style.pointerEvents = 'none'
      elCopy.style.border = 'none'
      rect = selectedEl.getBoundingClientRect()
      delta.x = Math.abs(e.x - rect.left)
      delta.y = Math.abs(e.y - rect.top)

      elCopy.style.left = (e.x - delta.x) + 'px'
      elCopy.style.top = (e.y - delta.y) + 'px' 

      document.body.classList.add('grabbing')
      document.body.appendChild(elCopy)
      document.addEventListener('mousemove', onDrag)
      document.removeEventListener('mousemove', onDragStart)
    }

    function onDrag (e) {
      e.preventDefault()

      hoveredTrack = trackElements.filter(el => el.contains(e.target))[0]

      if (hoveredTrack) {
        return snapToTrack(e.x, e.y, hoveredTrack)
      } 
      
      elCopy.style.left = (e.x - delta.x) + 'px'
      elCopy.style.top = (e.y - delta.y) + 'px'  

    }

    function snapToTrack (x, y, track) {
      let rect = track.getBoundingClientRect()
      let left = (x - delta.x)
      let top = (y - delta.y)

      if (Math.abs(rect.top - top) < 12) {

        // snap to top of track
        top = rect.top

        // snap to grid
        left = left - (left % 12)
      } else {

      }

      elCopy.style.left = left + 'px'
      elCopy.style.top = top + 'px'
    }

    function onDragEnd (e) {
      if (hoveredTrack) {
        let segmentId = selectedEl.dataset.id
        let trackId = hoveredTrack.dataset.id
        let x = (elCopy.getBoundingClientRect().left - hoveredTrack.getBoundingClientRect().left) / 12

        emit('arranger:addSegmentToTrack', {x, trackId, segmentId})
      }

      document.body.classList.remove('grabbing')
      document.removeEventListener('mouseup', onDragEnd)
      document.removeEventListener('mousemove', onDragStart)
      document.removeEventListener('mousemove', onDrag)
      selectedEl = null
      if (elCopy) {
        document.body.removeChild(elCopy)
        elCopy = null
      }
    }
  }
}