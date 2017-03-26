const uuid = require('../helpers/uuid')

module.exports = function arrangerStore (state, emitter) {
  initState(state)

  emitter.on('DOMContentLoaded', function () {

    document.body.addEventListener('keydown', e => {
      if (e.key === 'Backspace') {
        let {selectedTrackSegment} = state 
        if (selectedTrackSegment) {
          let track = state.tracks
            .find(track => track.id === selectedTrackSegment.trackId)
          

          track.segments = track.segments.filter(trackSegment => {
            return trackSegment.id !== selectedTrackSegment.id
          })

          emitter.emit('render')
        }
      }
    })

    emitter.on('deselect-segments', function () {
      state.selectedTrackSegment = null 
      state.selectedSegment = null

      emitter.emit('render')
    })

    emitter.on('arranger:selectTrackSegment', function (payload) {
      const {trackId, trackSegmentId} = payload

      const selected = state.tracks
        .find(track => track.id === trackId)
        .segments
        .find(trackSegment => trackSegment.id === trackSegmentId)

      selected.trackId = trackId

      state.selectedTrackSegment = selected 
      state.selectedSegment = null

      emitter.emit('render')
    })

    emitter.on('arranger:moveSegment', function (payload) {
      const {trackId, trackSegmentId, x} = payload

      let trackSegment = state.tracks
        .find(track => track.id === trackId)
        .segments
        .find(segment => segment.id === trackSegmentId)
      
      trackSegment.x = x

      emitter.emit('render')
    })

    emitter.on('arranger:addSegmentToTrack', function (payload) {
      const {x, segmentId, trackId} = payload
      const id = uuid()

      const segment = state.segments.find(segment => segment.id === segmentId)
      const trackSegment = Object.assign({}, segment, {x, segmentId, id})

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

function initState (state) {
  state.tracks = [{
    id: uuid(),
    segments: [], 
  }, 
  {
    id: uuid(),
    segments: []
  }]

  state.selectedTrackSegment = null
}