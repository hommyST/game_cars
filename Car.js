class Car {
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {HTMLImageElement} image 
   */
  constructor(x, y, image = new Image, speed = 1) {
    this.x = x
    this.y = y
    this._image = image
    this.speed = speed
    this.w = 0
    this.h = 0
    this.isInvincible = false
    this.invincibleCount = 0
    this.invincibleFlag = false
    this.remove = false

    this.init()
  }

  async init() {
    await this._image.decode()
    this.w = this._image.width
    this.h = this._image.height
  }

  set image(img) {
    this._image = img
    this.init()
  }

  get image() {
    return this._image
  }

  /**
   * @argument {CanvasRenderingContext2D} ctx
   * */
  show(ctx) {
    if (this.isInvincible === true) {
      this.invincibleCount++

      if (this.invincibleCount % 10 === 0) this.invincibleFlag = !this.invincibleFlag
      if (this.invincibleFlag) ctx.globalAlpha = 0.7
    }
    ctx.drawImage(this._image, this.x, this.y, this.w, this.h)
    ctx.globalAlpha = 1

    // debug
    // const inset = 6
    // ctx.globalAlpha = 0.4
    // ctx.lineWidth = 1
    // ctx.fillStyle = '#e91e63'
    // ctx.fillRect(this.x + inset,this.y + inset,this.w-inset *2,this.h-inset *2)
    // ctx.globalAlpha = 1
  }

  moveDown() {
    this.y += this.speed
  }

  hit(other) {
    const inset = 6
    const [x,y,w,h] = [this.x + inset, this.y + inset, this.w - inset * 2, this.h - inset * 2]
    const [ox,oy,ow,oh] = [other.x + inset, other.y + inset, other.w - inset * 2, other.h - inset * 2]

    if (ox + ow < x) return false
    if (x + w < ox) return false

    if (oy + oh < y) return false
    if (y + h < oy) return false

    return true
  }

  print() {
    console.log(this)
  }
}