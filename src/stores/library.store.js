const uuid = require('../helpers/uuid')

module.exports = function libraryStore (state, emitter) {
  initState(state)

  emitter.on('DOMContentLoaded', function () {

    emitter.on('deselect-segments', function () {
      state.selectedSegment = null
      // emitter.emit('render')
    })

    emitter.on('library:selectSegment', function (segmentId) {
      const selected = state.segments.find(segment => segment.id === segmentId)

      state.selectedSegment = selected
      state.selectedTrackSegment = null 

      // emitter.emit('render')
    })
  })
}

function initState (state) {
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
}