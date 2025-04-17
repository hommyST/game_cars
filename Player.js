class Player {
  constructor(car) {
    this.car = car
    this.score = 0
    this.life = 100
    this.invincibility = 250
    this.maxInvincibility = 250
    this.keysPressed = {}
    this.hitFrameCount = 50
    this.isHitFrame = false

    this.init()
  }

  init() {
    document.addEventListener('keydown', ({code}) =>{
      this.keysPressed[code] = true
    })
    document.addEventListener('keyup', ({code}) =>{
      this.keysPressed[code] = false
    })
  }

  update(canvas) {
    const width = canvas.width
    const height = canvas.height
    const inlineBound = 7
    let speed = this.car.speed

    // horizontal
    if (this.keysPressed.ArrowLeft === true) {
      if (this.car.x > inlineBound) this.car.x -= speed
    }
    if (this.keysPressed.ArrowRight === true) {
      if (this.car.x < width - inlineBound - this.car.w) this.car.x += speed
    }

    // vertical
    if (this.keysPressed.ArrowUp === true) {
      if (this.car.y > 300) {
        if (this.keysPressed.ArrowLeft === true || this.keysPressed.ArrowRight === true) speed *= 0.5
        this.car.y -= speed
        
      }
    }
    if (this.keysPressed.ArrowDown === true) {
      if (this.car.y + this.car.h < height) {
        if (this.keysPressed.ArrowLeft === true || this.keysPressed.ArrowRight === true) speed *= 0.
        this.car.y += this.car.speed
      }
    }

    if (this.keysPressed.Space === true) {
      if (this.invincibility > 0) {
        this.car.isInvincible = true
        this.invincibility--
      } else {
        this.car.isInvincible = false
      }
    } else {
      this.car.isInvincible = false
    }

    if (this.isHitFrame && this.hitFrameCount > 0) {
      this.hitFrameCount--
    } else {
      this.hitFrameCount = 100
      this.isHitFrame = false
    }


    // debug
    if (this.keysPressed.KeyZ) this.life--
    if (this.keysPressed.KeyA) this.life++
  }
}