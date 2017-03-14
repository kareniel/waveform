let width = 640
let div = 32
let len = width / div
let users = [
  createUser('a', div/2, div/2, 100),
  createUser('b', div/4, div/4, 100),
  createUser('c', div - 4, div/4 - 2, 100)
]

module.exports = function Radar () {
  this.init = () => {
    this.el = document.createElement('canvas')
    this.el.width = width
    this.el.height = '640'
    this.ctx = this.el.getContext('2d')
    this.circles = {}

    users.forEach(user => {
      let center = new Vector(user.pos.x, user.pos.y)
      this.circles[user.id] = new Circle(center, user.reach) 
    })

    document.addEventListener('move', e => onMove(e.detail.user))

    render()
  }

  this.onMove = user => {
    const circle = this.circles[user.id]

    if (circle) { 
      circle.setPosition(user.pos.x, user.pos.y)

      // do trilateration here 
    }
  }

  const render = () => {
    requestAnimationFrame(render)
    this.ctx.fillStyle = 'rgb(150, 150, 150)'
    this.ctx.fillRect(0,0,this.el.width, this.el.height)

    for (let i = 0; i < div; i++) { 
      this.ctx.strokeStyle = 'grey'
      this.ctx.beginPath() 
      this.ctx.moveTo(0, i * len)
      this.ctx.lineTo(this.el.width, i * len)
      this.ctx.stroke()
    }

    for (let i = 0; i < div; i++) {  
      this.ctx.strokeStyle = 'grey'
      this.ctx.beginPath() 
      this.ctx.moveTo(i * len, 0)
      this.ctx.lineTo(i * len, this.el.width)
      this.ctx.stroke()
    }

    Object.keys(this.circles).forEach(id => {
      let {center, radius} = this.circles[id]

      this.ctx.strokeStyle = 'black'
      this.ctx.beginPath()
      this.ctx.arc(center.x * len, center.y * len, 5, 0, 2 * Math.PI)
      this.ctx.stroke()

      this.ctx.strokeStyle = 'purple'
      this.ctx.beginPath()
      this.ctx.arc(center.x * len, center.y * len, radius, 0, 2 * Math.PI)
      this.ctx.stroke() 
    })
  
  }

  this.init()
}

// -------

function coinFlip() {
  return Math.floor(Math.random() * 2)
}

function createUser (id, x, y, reach) {
  return new User(id, x, y, reach)
}

function Vector (x, y) {
  this.x = x
  this.y = y

  this.distanceFrom = vector => {
    let a = this.x - vector.x
    let b = this.y - vector.y
    
    return Math.sqrt(a * a + b * b)
  }
}

function Circle (vector, radius) {
  this.center = vector
  this.radius = radius
  this.setPosition = (x, y) => {
    this.center = new Vector(x, y)
  }
}

function User (id, x, y, reach) {
  this.id = id
  this.pos = {x, y}
  this.reach = reach

  this.move = () => {
    const val = coinFlip() ? 1 : -1
    const horizontal = coinFlip()

    if (horizontal) {
      this.pos.x += val
    } else {
      this.pos.y += val
    }

    let user = this
    let event = new CustomEvent('move', {detail: {user}})
    
    document.dispatchEvent(event)
  }

  setInterval(this.move, (Math.random() * 2) * 5000)
}