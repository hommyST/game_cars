class Player {
  constructor(car) {
    this.car = car
    this.score = 0
    this.life = 1000
    this.invincibility = 250
    this.maxInvincibility = 250
    this.keysPressed = {}
    this.hitFrameCount = 50
    this.isHitFrame = false
    this.inlineBound = 7
    this.cnvW = 0
    this.cnvH = 0

    this.init()
  }

  init() {
    document.addEventListener('keydown', ({code}) =>{
      this.keysPressed[code] = true
    })
    document.addEventListener('keyup', ({code}) =>{
      this.keysPressed[code] = false
    })

    window.addEventListener('gamepadconnected', ev => {
      const currentGamepad = new Gamepad(ev.gamepad)
      currentGamepad.on('axischanged', ({index, value}) => {
        const inlineBound = this.inlineBound
        
        if (index === 0) {
          if (this.car.x > inlineBound && value < 0) {
            this.car.x += value * this.car.speed
          } else if (this.car.x + this.car.w < this.cnvW - inlineBound && value > 0) {
            this.car.x += value * this.car.speed
          }
        } else if (index === 1) {
          if (this.car.y > 300 && value < 0) {
            this.car.y += value * this.car.speed
          } else if (this.car.y + this.car.h < this.cnvH && value > 0) {
            this.car.y += value * this.car.speed
          }
        }
      })


      currentGamepad.on('buttondown', ({index}) => {
        if (![6,0].includes(index)) return

        if (this.invincibility > 0) {
          this.car.isInvincible = true
          this.invincibility--
        } else {
          this.car.isInvincible = false
        }
      })
      currentGamepad.on('buttonup', ({index}) => {
        if (![6,0].includes(index)) return
        this.car.isInvincible = false
      })
    })
    window.addEventListener('gamepaddisconnected', () => {
      // FIXME
      currentGamepad.offAll()
      currentGamepad = null
    })
  }

  update(canvas) {
    const width = canvas.width
    const height = canvas.height
    this.cnvW = width
    this.cnvH = height
    const inlineBound = this.inlineBound
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