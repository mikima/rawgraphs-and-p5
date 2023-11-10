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
  // Create a p5 instance
  let sketch = function (p) {
    let particles = []

    p.setup = function () {
      p.createCanvas(visualOptions.width, visualOptions.height, p.P2D, node)
      //for each line in data, create a particle
      data.forEach((row, i) => {
        particles.push(
          new particle(
            p,
            p.random(200, 300),
            p.random(200, 300),
            20,
            row.name,
            p.random(10)
          )
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

  function particle(p, x, y, r, name, blur, color) {
    const color1 = p.color(255, 204, 102)
    const color2 = p.color(100, 30, 230)

    this.x = x
    this.y = y
    this.r = r
    this.blur = blur
    this.seed = p.random(1000000)
    this.xyScale = 0.005
    this.zScale = 0.02
    this.noiseRange = 100
    this.opacity = 255
    this.color = color1

    // this.xSpeed = p.random(-2, 2)
    // this.ySpeed = p.random(-1, 1.5)

    this.update = function () {
      let fc = p.frameCount
      this.x = x + p.noise(this.seed + fc * this.xyScale) * this.noiseRange
      this.y =
        y + p.noise(this.seed + fc * this.xyScale + 10000) * this.noiseRange
      this.blur = p.noise(this.seed + fc * this.zScale + 20000) * 10
      this.r = p.noise(this.seed + fc * this.zScale + 20000) * r
      this.opacity = 255 - p.noise(this.seed + fc * this.zScale + 20000) * 255
      this.color = p.lerpColor(
        color1,
        color2,
        p.noise(this.seed + fc * this.zScale + 20000)
      )
      this.color.setAlpha(this.opacity)
      // this.x += this.xSpeed
      // this.y += this.ySpeed
      // if (this.x > p.width || this.x < 0) this.xSpeed *= -1
      // if (this.y > p.height || this.y < 0) this.ySpeed *= -1
    }

    this.show = function () {
      p.noStroke()
      p.fill(this.color)
      p.drawingContext.filter = 'blur(' + this.blur + 'px)'
      p.ellipse(this.x, this.y, this.r * 2)
      p.drawingContext.filter = 'blur(' + 0 + 'px)'
      p.text(name, this.x, this.y)
    }
  }

  new p5(sketch)
}
