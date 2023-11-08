import * as d3 from 'd3'
import '../d3-styles.js'
import p5 from 'p5'

export function render(
  node,
  data,
  visualOptions,
  mapping,
  originalData,
  styles
) {
  console.log(node)
  let container = node.parentNode
  container.removeChild(node)
  // Create a p5 instance
  let sketch = function (p) {
    let particles = []

    p.setup = function () {
      p.createCanvas(500, 500)
      //for each line in data, create a particle
      data.forEach((row, i) => {
        particles.push(
          new particle(p, p.random(200,300), p.random(200,300), 20, row.name, p.random(10))
        )
      })
    }

    p.draw = function () {
      p.background('black')
      particles.forEach((particle, i) => {
        particle.update()
        particle.show()
      })
    }
  }

  function particle(p, x, y, r, name, blur) {
    this.x = x
    this.y = y
    this.r = r
    this.blur = blur
    this.seed = p.random(1000000)
    this.xyScale = 0.005
    this.zScale = 0.02
    this.noiseRange =100
    this.opacity = 255
    // this.xSpeed = p.random(-2, 2)
    // this.ySpeed = p.random(-1, 1.5)

    this.update = function () {
      let fc = p.frameCount
      this.x = x+p.noise(this.seed + fc*this.xyScale) * this.noiseRange
      this.y = y+p.noise(this.seed + fc*this.xyScale + 10000) * this.noiseRange
      this.blur = p.noise(this.seed + fc*this.zScale + 20000) * 10
      this.r = p.noise(this.seed + fc*this.zScale + 20000) * r
      this.opacity = 255- p.noise(this.seed + fc*this.zScale + 20000)*255
      // this.x += this.xSpeed
      // this.y += this.ySpeed
      // if (this.x > p.width || this.x < 0) this.xSpeed *= -1
      // if (this.y > p.height || this.y < 0) this.ySpeed *= -1
    }

    this.show = function () {
      p.noStroke()
      p.fill(255, this.opacity)
      p.drawingContext.filter = 'blur(' + this.blur + 'px)'
      p.ellipse(this.x, this.y, this.r * 2)
      p.drawingContext.filter = 'blur(' + 0 + 'px)'
      p.text(name, this.x, this.y)
    }
  }

  new p5(sketch, container)
  // d3.select(node)
  //   .selectAll('text')
  //   .data(data)
  //   .enter()
  //   .append('text')
  //   .attr('fill', visualOptions.color)
  //   .attr('x', (_, i) => 35 + i * 10)
  //   .attr('y', (_, i) => 35 + i * 25)
  //   .text((row) => row.name)
  //   .styles(styles.coolText)
}
