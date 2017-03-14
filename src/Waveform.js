const toWav = require('audiobuffer-to-wav')
const Handle = {x: null, hovered: false}
const defaultOptions = { width: 960, height: 150 }
const BLUE = 'rgb(2, 123, 231)'
const GREEN = 'rgb(12, 242, 0)'
const WHITE = 'rgb(255, 255, 255)'

module.exports = function Waveform (url, opts = defaultOptions) {
  const _this = this
  let x

  this.init = () => {
    this.loading = true
    
    this.segments = []
    this.el = document.createElement('div')

    this.canvas = this.el.appendChild(document.createElement('canvas'))
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = opts.width
    this.canvas.height = opts.height
    this.canvas.style.cursor = 'pointer'
    this.canvas.addEventListener('mousedown', e => this.handleClick(e))

    this.leftHandle = Object.create(Handle)
    this.rightHandle = Object.create(Handle)
    this.selecting = false
    this.looping = false

    this.audioCtx = new AudioContext()

    const playButton = this.el.appendChild(document.createElement('button'))
    playButton.innerHTML = 'Play!'
    playButton.addEventListener('click', e => this.play())

    const loopingButton = this.el.appendChild(document.createElement('button'))
    loopingButton.innerHTML = 'Looping: Off'
    loopingButton.disabled = true
    loopingButton.addEventListener('click', e => this.toggleLooping())

    const exportButton = this.el.appendChild(document.createElement('button'))
    exportButton.innerHTML = 'Save Segment'
    exportButton.addEventListener('click', e => this.saveSegment())

    fetch(url)
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => this.loadAudioBuffer(audioBuffer))
  }

  this.handleClick = e => {
    if (this.withinReach(this.leftHandle.x)) { 
      return this.onDragMarker(this.leftHandle) 
    }
    
    if (this.withinReach(this.rightHandle.x)) { 
      return this.onDragMarker(this.rightHandle) 
    }

    this.leftHandle.x = this.mouseX
    this.rightHandle.x = null
    this.onDrag(e)
  }

  this.loadAudioBuffer = audioBuffer => {
    this.loading = false
    this.audioBuffer = audioBuffer
    this.peaks = []
    
    const arr = audioBuffer.getChannelData(0)
    const width = Math.ceil(arr.length / this.canvas.width)
    const height = this.canvas.height / 2 

    let samples, min, max, s, pair

    for (let i = 0; i < this.canvas.width; i++) {
      samples = arr.slice(i*width, i*width+width)
      min = samples[0]
      max = samples[0]

      for (let i = 0; i < samples.length; i++) {

        s = samples[i]
        max = s > max ? s : max
        min = s < min ? s : min
      }

      pair = [(min * (height*1.5)) + height, (max * (height*1.5)) + height]

      this.peaks.push(pair)  
    }
  }

  this.saveSegment = () => {
    const begin = (this.leftHandle.x / this.canvas.width) * this.audioBuffer.duration
    const end = (this.rightHandle.x / this.canvas.width) * this.audioBuffer.duration

    const startOffset = this.audioBuffer.sampleRate * begin
    const endOffset = this.audioBuffer.sampleRate * end
    const frameCount = endOffset - startOffset

    const buffer = this.audioCtx.createBuffer(2, frameCount, this.audioCtx.sampleRate)
    const anotherArray = new Float32Array(frameCount)

    for (let channel = 0; channel < this.audioBuffer.numberOfChannels; channel ++) {
      this.audioBuffer.copyFromChannel(anotherArray, channel, startOffset)
      buffer.copyToChannel(anotherArray, channel, 0)
    }

    const wav = toWav(buffer)
    const blob = new Blob([wav], {type: 'audio/wav'})

    this.segments.push(blob)
  }

  this.downloadSegment = (blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = 'segment.wav'
    a.href = url
    a.click()
    URL.revokeObjectURL(url)
  }

  this.toggleLooping = () => {
    if (!this.looping) {
      this.looping = true
      this.loopingButton.innerHTML = 'Looping: On'
    } else {
      this.looping = false
      this.loopingButton.innerHTML = 'Looping: Off'
    }
  }

  this.pause = () => {
    this.pausedAt = this.audioCtx.currentTime
  }

  this.play = (start) => {
    if (this.audioSource) { 
      this.audioSource.disconnect()
    }

    const x1 = this.leftHandle.x
    const x2 = this.rightHandle.x
    const total = this.audioBuffer.duration 

    start = start || (this.pausedAt ? this.pausedAt : (x1 / this.canvas.width ) * total)
    const duration = (x2 ? (x2 - x1) / this.canvas.width * total : undefined)

    this.audioSource = this.audioCtx.createBufferSource()
    this.audioSource.buffer = this.audioBuffer
    this.audioSource.connect(this.audioCtx.destination)
    this.audioSource.start(0, start)

    this.startedAt = this.audioCtx.currentTime - start
  }

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
      _this.selecting = false

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

  let hasSelection

  this.render = () => {
    requestAnimationFrame(this.render)

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (this.loading) {
      this.ctx.fillStyle = 'rgb(255, 255, 255)'
      return this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    this.ctx.fillStyle = 'rgb(50, 50, 50)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    hasSelection = (this.leftHandle.x && this.rightHandle.x)

    /* waveform */
    if (this.peaks) {
      this.ctx.lineWidth = 1
      this.peaks.forEach((a, i) => {
        if (hasSelection && this.betweenHandles(i)) {
          this.ctx.strokeStyle = GREEN
        } else {
          this.ctx.strokeStyle = BLUE
        }
        this.ctx.beginPath()
        this.ctx.moveTo(i + 1, a[0])
        this.ctx.lineTo(i, a[1])
        this.ctx.stroke()
      })
    }

    /* mouse cursor */
    if (this.leftHandle.hovered || this.rightHandle.hovered) {
      this.canvas.style.cursor = 'col-resize'
    } else {
      this.canvas.style.cursor = 'pointer'
    }

    /* left handle */
    if (this.leftHandle.x && this.leftHandle.hovered && !this.selecting) {
      this.ctx.lineWidth = 3
      this.ctx.strokeStyle = GREEN
      this.ctx.beginPath()
      this.ctx.moveTo(this.leftHandle.x, this.canvas.height)
      this.ctx.lineTo(this.leftHandle.x, 0)
      this.ctx.stroke()
    } else if (!this.rightHandle.x) {
      this.ctx.lineWidth = 1
      this.ctx.strokeStyle = GREEN
      this.ctx.beginPath()
      this.ctx.moveTo(this.leftHandle.x, this.canvas.height)
      this.ctx.lineTo(this.leftHandle.x, 0)
      this.ctx.stroke()
    }

    /* right handle */
    if (this.rightHandle.x && this.rightHandle.hovered && !this.selecting) {
      this.ctx.lineWidth = 3
      this.ctx.strokeStyle = GREEN
      this.ctx.beginPath()
      this.ctx.moveTo(this.rightHandle.x, this.canvas.height)
      this.ctx.lineTo(this.rightHandle.x, 0)
      this.ctx.stroke()
    }

    /* current time cursor */
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = 'white'
    this.ctx.beginPath()
    this.ctx.moveTo(this.getCurrentTime() / this.audioBuffer.duration * this.canvas.width, this.canvas.height)
    this.ctx.lineTo(this.getCurrentTime() / this.audioBuffer.duration * this.canvas.width , 0)
    this.ctx.stroke()
    
    /* hover cursor */
    if (!this.leftHandle.hovered && !this.rightHandle.hovered) {
      this.ctx.lineWidth = 1
      this.ctx.strokeStyle = 'white'
      this.ctx.beginPath()
      this.ctx.moveTo(this.mouseX, this.canvas.height)
      this.ctx.lineTo(this.mouseX, 0)
      this.ctx.stroke()
    }
  }

  this.betweenHandles = i => {
    if (this.leftHandle.x < this.rightHandle.x) {
      return (i >= this.leftHandle.x && i <= this.rightHandle.x)
    } else {
      return (i >= this.rightHandle.x && i <= this.leftHandle.x)
    }
  }

  this.getCurrentTime = () => {
    return this.audioCtx.currentTime - this.startedAt
  }

  this.withinReach = x => {
    return (this.mouseX > x - 3) && (this.mouseX < x + 3)
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

  this.init()

}