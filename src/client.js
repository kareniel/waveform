const choo = require('choo')
const html = require('choo/html')

const app = choo()

app.use(store)
app.route('/', layout)

app.mount('body')

const dragIcon = html`<img src="#">`

function layout (state, emit) {
  let bodyEl = document.getElementsByTagName('body')[0]
  const bars = 80
  const barWidth = 12
  const fullWidth = bars * barWidth

  let distance, rect, newPos, leftBound, rightBound

  const segment = html`
    <div 
      draggable="true"
      class="segment-block" 
      onmousedown=${onMouseDown}
      ondrag=${onDrag}
      ondragstart=${onDragStart}
      ondrop=${onDrop}
      ondragend=${onDragEnd}>
    </div>`

  return html`
    <body>

      <nav>
        <label>length: </label>
        <input type="number" min="0" value=${bars} step="4">
        <span>bars</span>
      </nav>

      <div id="top-half">
        <section id="timeline">

          <div 
            class="rail" 
            ondragenter=${onDragEnter}
            ondragover=${onDragOver}
            ondragleave=${onDragLeave}
            style="min-width: ${fullWidth}px;">
            ${segment}
          </div>

        </section>
      </div>

      <div id="bottom-half">
        <div id="segment-browser">
          <p>segments</p>
        </div>

        <section id="waveform-editor">
          <p>selected waveform</p>
        </section>
      </div>
    </body>
  `

  function onDrag (e) {
  }

  function onMouseDown (e) {
    // keep track of the distance between mouse and left side of block
    distance = Math.abs(e.x - segment.getBoundingClientRect().left)
  }

  function onDragStart (e) {
    e.dataTransfer.setDragImage(dragIcon, -9999, -9999)
  }

  function onDragEnter (e) {

  }

  function onDragOver (e) {
    if (e.preventDefault) {
      e.preventDefault()
    }

    e.dataTransfer.dropEffect = 'move'

    let segmentRect = segment.getBoundingClientRect()
    let width = segment.getBoundingClientRect().right - segment.getBoundingClientRect().left
    let leftBound = this.getBoundingClientRect().left
    let rightBound = fullWidth - width

    newPos = (e.x - distance - leftBound)

    if (newPos <= 0) {
      newPos = 0
    }

    if (newPos >= rightBound) {
      newPos = rightBound
    }

    segment.style.left = newPos > 0 ? newPos + 'px' : '0px'

    return false
  }

  function onDragLeave (e) {

  }

  function onDragEnd (e) {
  }

  function onDrop (e) {

  }
}

function store (state, emitter) {
  emitter.on('DOMContentLoaded', function () {
    // wf.render()
  })
}
