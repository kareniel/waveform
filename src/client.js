const choo = require('choo')
const html = require('choo/html')

const uuid = require('./helpers/uuid')

const app = choo()

// app.use(logger)
app.use(store)
app.route('/', require('./elements/layout.el'))
app.mount('body')

function store (state, emitter) {
  state.tracks = [{
    id: uuid(),
    segments: [], 
  }, 
  {
    id: uuid(),
    segments: []
  }]

  state.trackElements = []
  state.segments = [{
    id: uuid(),
    title: 'Pold & Baribal - Senses',
    color: 'red',
    length: 16
  }, {
    id: uuid(),
    title: 'HMU - Angel City',
    color: 'purple',
    length: 8
  }, {
    id: uuid(),
    title: 'Jonny Ha$h - Circular Time',
    color: 'green',
    length: 32
  }]
  state.selectedSegment = null
  state.selectedTrackSegment = null

  emitter.on('DOMContentLoaded', function () {

    emitter.on('editor:selectSegment', function (segment) {
      state.selectedSegment = segment
      state.selectedTrackSegment = null 
      emitter.emit('render')
    })

    emitter.on('timeline:deselectTrackSegment', function (payload) {
      state.selectedTrackSegment = null 

      emitter.emit('render')
    })

    emitter.on('timeline:selectTrackSegment', function (payload) {
      const {trackId, trackSegmentId} = payload

      const selected = state.tracks
        .find(track => track.id === trackId)
        .segments
        .find(trackSegment => trackSegment.id === trackSegmentId)

      state.selectedTrackSegment = selected 
      state.selectedSegment = null

      emitter.emit('render')
    })

    emitter.on('timeline:moveSegment', function (payload) {
      const {trackId, trackSegmentId, x} = payload

      let trackSegment = state.tracks
        .find(track => track.id === trackId)
        .segments
        .find(segment => segment.id === trackSegmentId)
      
      trackSegment.x = x

      emitter.emit('render')
    })

    emitter.on('timeline:addSegmentToTrack', function (payload) {
      const {segmentData, trackId} = payload
      const trackSegment = Object.assign({}, segmentData, {
        segmentId: segmentData.id,
        id: uuid(),
      })

      state.tracks.map(track => {
        if (track.id === trackId) {
          track.segments.push(trackSegment)
          track.segments = track.segments.sort(sortByX)
        }
        return track
      })

      emitter.emit('render')
    })
  })
}

function sortByX (a, b) {
  return a.x - b.x 
}

function logger (state, emitter) {
  emitter.on('*', function (messageName, data) {
    if (messageName !== 'render') {
      console.log('event', messageName, data)
    }
  })
}
