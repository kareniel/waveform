const Handle = {x: null, hovered: false}

module.exports = function Waveform (width, height) {
  const _this = this
  const el = document.createElement('canvas')

  el.width = width
  el.height = height
  el.style.cursor = 'pointer'

  this.canvas = el
  this.ctx = el.getContext('2d')
  this.leftHandle = Object.create(Handle)
  this.rightHandle = Object.create(Handle)
  this.selecting = false

  let x

  this.canvas.addEventListener('mousedown', e => {
    if (this.withinReach(this.leftHandle.x)) { 
      return this.onDragMarker(this.leftHandle) 
    }
    
    if (this.withinReach(this.rightHandle.x)) { 
      return this.onDragMarker(this.rightHandle) 
    }

    this.leftHandle.x = this.mouseX
    this.rightHandle.x = null
    this.onDrag(e)
  })

  this.onDragMarker = handle => {
    document.addEventListener('mousemove', onDragMarkerMouseMove) 
    document.addEventListener('mouseup', onDragMarkerMouseUp)

    function onDragMarkerMouseMove (e) {
      handle.x = _this.mouseX
    }

    function onDragMarkerMouseUp (e) {
      document.removeEventListener('mousemove', onDragMarkerMouseMove)
      document.removeEventListener('mouseup', onDragMarkerMouseUp)

      if (_this.leftHandle.x > _this.rightHandle.x) {
        _this.reverseHandles()
      }
    }
  }

  /* Left handle should always be on the left of the right handle */
  this.reverseHandles = () => {
    const leftHandlePosition = this.leftHandle.x
    const rightHandlePosition = this.rightHandle.x
    this.leftHandle.x = rightHandlePosition
    this.rightHandle.x = leftHandlePosition
  }

  this.onDrag = e => {
    this.selecting = true

    document.addEventListener('mousemove', onDragMouseMove) 
    document.addEventListener('mouseup', onDragMouseUp)

    function onDragMouseMove (e) {
      _this.rightHandle.x = _this.mouseX
    }

    function onDragMouseUp (e) {
      this.selecting = false

      document.removeEventListener('mousemove', onDragMouseMove)
      document.removeEventListener('mouseup', onDragMouseUp)

      // Probably a single click
      if (_this.mouseX === _this.leftHandle.x) {
        return _this.rightHandle.x = null
      }

      if (_this.leftHandle.x > _this.rightHandle.x) {
        _this.reverseHandles()
      }
    }
  }

  this.render = () => {
    requestAnimationFrame(this.render)

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.fillStyle = 'rgb(50, 50, 50)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    /* mouse cursor */
    if (this.leftHandle.hovered || this.rightHandle.hovered) {
      this.canvas.style.cursor = 'col-resize'
    } else {
      this.canvas.style.cursor = 'pointer'
    }

    /* selection */
    if (this.leftHandle.x && this.rightHandle.x) {
      this.ctx.beginPath()
      this.ctx.fillStyle = 'rgb(20, 20, 20)'
      this.ctx.fillRect(this.leftHandle.x, 0, this.rightHandle.x - this.leftHandle.x, this.canvas.height)
    }

    /* left handle */
    if (this.leftHandle.x) {
      this.ctx.lineWidth = this.leftHandle.hovered ? 4 : 1
      this.ctx.strokeStyle = this.leftHandle.hovered ? 'blue' : 'black'
      this.ctx.beginPath()
      this.ctx.moveTo(this.leftHandle.x, this.canvas.height)
      this.ctx.lineTo(this.leftHandle.x, 0)
      this.ctx.stroke()
    }

    /* right handle */
    if (this.rightHandle.x) {
      this.ctx.lineWidth = this.rightHandle.hovered ? 4 : 1
      this.ctx.strokeStyle = this.rightHandle.hovered ? 'blue' : 'black'
      this.ctx.beginPath()
      this.ctx.moveTo(this.rightHandle.x, this.canvas.height)
      this.ctx.lineTo(this.rightHandle.x, 0)
      this.ctx.stroke()
    }

    /* time cursor */
    if (!this.leftHandle.hovered && !this.rightHandle.hovered) {
      this.ctx.lineWidth = 1
      this.ctx.strokeStyle = 'white'
      this.ctx.beginPath()
      this.ctx.moveTo(this.mouseX, this.canvas.height)
      this.ctx.lineTo(this.mouseX, 0)
      this.ctx.stroke()
    }
  }

  this.withinReach = x => {
    return (this.mouseX > x - 2) && (this.mouseX < x + 2)
  }

  /* Keeps track of the mouse position on the canvas */
  document.addEventListener('mousemove', e => {
    x = e.clientX - this.canvas.getBoundingClientRect().left

    if (x <= 0) { x = 1 }
    if (x >= this.canvas.width) { x = this.canvas.width - 1}

    if (this.withinReach(this.leftHandle.x)) {
      this.leftHandle.hovered = true
    } else {
      this.leftHandle.hovered = false
    }

    if (this.withinReach(this.rightHandle.x)) {
      this.rightHandle.hovered = true
    } else {
      this.rightHandle.hovered = false
    }

    this.mouseX = x
  })
}