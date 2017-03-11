const yo = require('yo-yo')

const width = 800
const height = 120
const canvas = yo`
  <canvas 
    width=${width} 
    height=${height}
    onmousedown=${onmousedown}
  ></canvas>`

document.addEventListener('mousemove', mousemove)

let ctx = canvas.getContext('2d')

document.body.appendChild(canvas)

let x 
let mouseX, selecting
let leftMarker = null
let rightMarker = null    

function mousemove (e) {
  x = e.clientX - canvas.getBoundingClientRect().left
  if (x < 0) {
    return mouseX = 1
  }
  if (x >= width) {
    return mouseX = width - 1
  }
  return mouseX = x
}

function onmousedown (e) {
  if (mouseX === leftMarker) {
    // reposition left marker
    return repositionLeftMarker()
  }

  if (mouseX === rightMarker) {
    // reposition right marker
    return repositionRightMarker()
  }

  selecting = true
  leftMarker = e.clientX - e.target.getBoundingClientRect().left
  rightMarker = null

  document.addEventListener('mouseup', mouseup)
  document.addEventListener('mousemove', mousemove)

  function mouseup (e) {
    if (leftMarker === rightMarker) {
      rightMarker = null
    }

    if (leftMarker > rightMarker) {
      const left = leftMarker
      leftMarker = rightMarker
      rightMarker = left
    }

    if (leftMarker < 0) {
      leftMarker = 1
    }

    if (rightMarker > width) {
      rightMarker = width - 1
    }

    document.removeEventListener('mouseup', mouseup)
    document.removeEventListener('mousemove', mousemove)

    selecting = false
    console.log(leftMarker, rightMarker)
  }

  function mousemove (e) {
    rightMarker = e.clientX - canvas.getBoundingClientRect().left
  }
}

function repositionLeftMarker () {
  selecting = true
  document.addEventListener('mouseup', mouseup1)
  document.addEventListener('mousemove', mousemove1)

  function mouseup1 () {
    if (leftMarker > rightMarker) {
      const left = leftMarker
      leftMarker = rightMarker
      rightMarker = left
    }
    document.removeEventListener('mouseup', mouseup1)
    document.removeEventListener('mousemove', mousemove1)
    console.log(leftMarker, rightMarker)
    selecting = false
  }

  function mousemove1 (e) {
    x = e.clientX - canvas.getBoundingClientRect().left

    if (leftMarker < 0) {
      return leftMarker = 1
    }

    if (rightMarker > width) {
      return rightMarker = width - 1
    }

    leftMarker = x
  }
}

function repositionRightMarker () {
  selecting = true
  document.addEventListener('mouseup', mouseup2)
  document.addEventListener('mousemove', mousemove2)

  function mouseup2 () {
    if (leftMarker > rightMarker) {
      const left = leftMarker
      leftMarker = rightMarker
      rightMarker = left
    }
    document.removeEventListener('mouseup', mouseup2)
    document.removeEventListener('mousemove', mousemove2)
    console.log(leftMarker, rightMarker)
    selecting = false
  }

  function mousemove2 (e) {
    rightMarker = e.clientX - canvas.getBoundingClientRect().left
    
  }
}

function render () {
  requestAnimationFrame(render)
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = 'rgb(150, 150, 150)'
  ctx.fillRect(0, 0, width, height)
  drawMarkers()
  drawCursor()
  if (mouseX === leftMarker || mouseX === rightMarker) {
    document.body.style.cursor = 'col-resize'
  } else {
    document.body.style.cursor = 'pointer'
  }
}

render()

function drawMarkers () {
  if (leftMarker) {
    ctx.lineWidth = 2
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(leftMarker, height)
    ctx.lineTo(leftMarker, 0)
    ctx.stroke()
  }

  if (rightMarker) {
    ctx.lineWidth = 2
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(rightMarker, height)
    ctx.lineTo(rightMarker, 0)
    ctx.stroke()
  }

  if (leftMarker && rightMarker) {
    ctx.beginPath()
    ctx.fillStyle = 'rgb(100, 100, 100)'
    ctx.fillRect(leftMarker, 0, rightMarker - leftMarker, height)
  }
}

function drawCursor () {
  if ((mouseX === leftMarker) || (mouseX === rightMarker)) {
    ctx.lineWidth = 2
    ctx.strokeStyle = 'blue'
    ctx.beginPath()
    ctx.moveTo(mouseX, height)
    ctx.lineTo(mouseX, 0)
    ctx.stroke()
  }
}
