class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  get heading() {
    return Math.atan2(this.y, this.x)
  }

  get mag() {
    return Math.sqrt(this.magSq)
  }

  get magSq() {
    const x = this.x
    const y = this.y
    return x * x + y * y
  }

  set mag(n) {
    this.normalize()
    this.mult(n)
  }

  mult(...args) {
    let [x, y] = args
    if (args.length === 1) {
      this.x *= x;
      this.y *= x;
    }
    if (args.length === 2) {
      this.x *= x;
      this.y *= y;
    }
  }

  add(...args) {
    let [x, y] = args
    if (args.length === 1) {
      this.x += x;
      this.y += x;
    }
    if (args.length === 2) {
      this.x += x;
      this.y += y;
    }
  }

  sub(...args) {
    let [x, y] = args
    if (args.length === 1) {
      this.x -= x;
      this.y -= x;
    }
    if (args.length === 2) {
      this.x -= x;
      this.y -= y;
    }
  }

  copy() {
    return new Vector(this.x, this.y)
  }

  normalize() {
    const len = this.mag
    
    if (len !== 0) this.mult(1 / len)
  }

  limit(max) {
    const mSq = this.magSq
    if (mSq > max * max) {
      this.normalize()
      this.mag = max
    }
  }

  print() {
    console.log(
      `%cX%c = ${this.x}; %cY%c = ${this.y}; %cMag%c = ${this.mag}`,

      'color: #2196f3;',
      'color: #bdbdbd',
      'color: #2196f3;',
      'color: #bdbdbd',
      'color: #2196f3;',
      'color: #bdbdbd',
    )
  }




  /* STATIC staff */
  static toDegree(angle) {
    return angle * 180 / Math.PI
  }

  static fromAngle(angle) {
    return new Vector(Math.cos(angle), Math.sin(angle));
  }

}
