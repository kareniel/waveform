# Drawing Waveforms

Let's make a web component that allows you to visualize a waveform from a sound file (mp3 or wav), zoom into it and select a segment you want to export. Using HTML canvas and the Web Audio API.


```js
const audioCtx = new AudioContext

fetch('/data/cosmicosmo-twoson.mp3')
  .then(res => res.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
    const source = audioCtx.createBufferSource()
    source.buffer = audioBuffer
  })
```

```js
const el = yo`<canvas width="500" height="120"></canvas>` 
const gl = el.getContext('webgl')


```

---

## ideas

- do any audio processing in a web worker
- compute waveform data on the gpu


`AudioContext.decodeAudioData()`

a buffer of PCM samples


- fetch a sound file (wav, mp3) as an ArrayBuffer
- decode it using `AudioContext.decodeAudioData()` into a buffer of PCM samples (AudioBuffer)



## Read more 

http://www.bbc.co.uk/rd/blog/2013/10/audio-waveforms
