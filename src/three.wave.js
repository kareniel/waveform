const three = require('three')

const values = [0,0,30,0,0,30,0,0,5,7,10,7,15,4,0,2,5,7,8,9,10,11,12,14,15,4,2]
const width = 500
const height = 120

const renderer = new three.WebGLRenderer()
const camera = new three.OrthographicCamera(width/-2, width / 2, height / 2, height / - 2, 1, 1000)
const scene = new three.Scene()
const line = getLine(values)
const line2 = getLine(values.map(v=>-v))

renderer.setSize(width, height)
camera.position.set(width/2, 0, 1)

scene.add(line)
scene.add(line2)

document.body.appendChild(renderer.domElement)

render()

function getLine (values) {
  const material = new three.LineBasicMaterial({color:0x00fff0})
  const geometry = new three.Geometry()
  
  values.forEach((value, i) => {
    geometry.vertices.push(new three.Vector3(i, value, 0))
  })

  const line = new three.Line(geometry, material)
  return line
}

function render () {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}