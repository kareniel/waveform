const choo = require('choo')
const html = require('choo/html')

const app = choo()

app.use(logger)
app.use(store)
app.route('/', require('./elements/layout.el'))
app.mount('body')

function store (state, emitter) {
  state.tracks = [
  {
    id: 0,
    segments: [], 
  }, 
  {
    id: 1,
    segments: []
  }
  ]

  state.trackElements = []
  state.segments = [{
    id: 0,
    title: 'Pold & Baribal - Senses',
    color: 'red',
    length: 16
  }, {
    id: 1,
    title: 'HMU - Angel City',
    color: 'purple',
    length: 8
  }, {
    id: 2,
    title: 'Jonny Ha$h - Circular Time',
    color: 'green',
    length: 32
  }]
  state.selectedSegment = null

  emitter.on('DOMContentLoaded', function () {

    emitter.on('editor:selectSegment', function (segment) {
      state.selectedSegment = segment
      emitter.emit('render')
    })

    emitter.on('timeline:addSegmentToTrack', function (payload) {
      state.tracks.map(track => {
        if (track.id === payload.trackId) {
          track.segments.push(payload.segmentData)
        }
        return track
      })

      emitter.emit('render')
    })
  })
}

function logger (state, emitter) {
  emitter.on('*', function (messageName, data) {
    if (messageName !== 'render') {
      console.log('event', messageName, data)
    }
  })
}
