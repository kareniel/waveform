const html = require('choo/html')

module.exports = function segmentLibrary (state, emit) {
  return html `
    <div id="segment-library">
      <ul>
        ${state.segments.map(segment => {
          let classes = ['segment-block', 'is-grabbable']

          if (state.selectedSegment === segment) {
            classes.push('is-selected')
          }

          return html`
            <li 
              class="${classes.join(' ')}" 
              onclick=${e => select(segment)} 
              onmousedown=${handleDrag}>
              ${segment.title}
            </li>
          `
        })}
      </ul>
    </div>
  `

  function select (segment) {
    emit('editor:selectSegment', segment)
  }

  function handleDrag (e) {
    let selectedEl = e.target
    let rect, elCopy
    let delta = {x: 0, y: 0}

    document.addEventListener('mousemove', onDragStart)
    document.addEventListener('mouseup', onDragEnd)

    function onDragStart (e) {
      e.preventDefault()
      elCopy = selectedEl.cloneNode(true)
      elCopy.style.position = 'absolute'
      rect = selectedEl.getBoundingClientRect()
      delta.x = Math.abs(e.x - rect.left)
      delta.y = Math.abs(e.y - rect.top)

      document.body.appendChild(elCopy)
      document.addEventListener('mousemove', onDrag)
      document.removeEventListener('mousemove', onDragStart)
    }

    function onDrag (e) {
      e.preventDefault()
      elCopy.style.left = (e.x - delta.x) + 'px'
      elCopy.style.top = (e.y - delta.y) + 'px'
    }

    function onDragEnd (e) {
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