class Gamepad {
  constructor(gp) {
    this._gamepad = gp
    this._pressedBtns = new Set
    this._axisDeadZone = gp.axes.map(() => 0)
    this._eventHandlers = {
      buttondown: new Set,
      buttonup: new Set,
      axischanged: new Set,
    }

    this.loop()
  }

  get gamepad() {
    return this._gamepad
  }
  get buttons() {
    return this._gamepad.buttons
  }
  get axis() {
    return this._gamepad.axes
  }
  get title() {
    return this._gamepad.id
  }
  get isConnected() {
    return this._gamepad.connected
  }
  get index() {
    return this._gamepad.index
  }

  setAxisDeadZone(index, value = 0) {
    if (!this._axisDeadZone[index]) {
      console.error(`there is no ${index} axis in you gamepad`)
      return
    }
    if (value < 0 || value > 1) {
      console.error(`value must be in range from 0 to 1`)
      return
    }

    this._axisDeadZone[index] = value
  }
  setAllAxisDeadZone(value = 0) {
    if (value < 0 || value > 1) {
      console.error(`value must be in range from 0 to 1`)
      return
    }

    this._axisDeadZone.fill(value)
  }

  on(type = '', callback) {
    if (type in this._eventHandlers === false) {
      console.error(`type ${type} dont exist
        try some of this: "${Object.keys(this._eventHandlers).join('/')}"`)
      return
    }
    this._eventHandlers[type].add(callback)
  }
  off(type = '', callback) {
    if (type in this._eventHandlers === false) {
      console.error(`type ${type} dont exist
        try some of this: "${Object.keys(this._eventHandlers).join('/')}"`)
      return
    }
    this._eventHandlers[type].delete(callback)
  }
  offAll() {
    for (let key in this._eventHandlers) {
      let handlers = this._eventHandlers[key]
      handlers.clear()
    }
  }

  loop() {
    if (!this._gamepad || this._gamepad.connected === false) return
    this._gamepad = navigator.getGamepads()[this.index]
    for (let i = 0; i < this._gamepad.buttons.length; i++) {
      let btn = this._gamepad.buttons[i]
      if (btn.pressed) {
          this._eventHandlers.buttondown.forEach(cb => {
            cb({index: i, value: btn.value, buttons: this.buttons})
          })
          this._pressedBtns.add(i)
      } else {
        if (this._pressedBtns.has(i)) {
          this._eventHandlers.buttonup.forEach(cb => {
            cb({index: i, value: btn.value, buttons: this.buttons})
          })
          this._pressedBtns.delete(i)
        }
      }
    }

    for (let i = 0; i < this._gamepad.axes.length; i++) {
      let ax = this._gamepad.axes[i]
      if (ax > this._axisDeadZone[i] || ax < (this._axisDeadZone[i] * -1)) {
        this._eventHandlers.axischanged.forEach(cb => {
          cb({index: i, value: ax, axis: this.axis})
        })
      }
    }

    requestAnimationFrame(() => this.loop())
  }
}