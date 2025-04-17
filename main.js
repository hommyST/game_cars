/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas1')
const ctx = canvas.getContext('2d')
const lines = [56, 161, 264]

canvas.width = 320
canvas.height = 550

let playerCar

//Globals vars
let a = b = c = 0

let life
let score = 0
let invincible = 250
let plCarLife

let linePosY = -550

let carPosX = 132
let carPosY = 440

let enCarPosY1 = -104
let enCarPosY2 = -204
let enCarPosY3 = -304

let carsSpeed = []
let imgCars = []
let plCar
let keyState = {}

let imgRoad
let imgLine

let soundEngine = new Audio('./audio/engine.mp3')

//запуск игры
// document.querySelector('#start_btn').addEventListener('click', init)
init()

// imgRoad = new Image()
// imgRoad.src = './images/road.png'

// let road = new Car(0, 0, imgRoad)
// road.print()



function init() {
  const playerImage = new Image()
  playerImage.src = './images/playerCar.png'
  playerCar = new Car(132, 440, playerImage)
  
  //Подготовка DOM
  // life = document.querySelector('#life__input').value
  life = 250
  // document.querySelector('.wrap').classList.add('_hide')
  // document.querySelector('#start_btn').removeEventListener('click', init)
  canvas.classList.remove('_hide')

  //Создаём дорогу и машину игрока
  imgRoad = new Image()
  imgRoad.src = './images/road.png'
  imgLine = new Image()
  imgLine.src = './images/line.png'
  plCar = new Image()
  plCar.src = './images/playerCar.png'
  plCarLife = new Image()
  plCarLife.src = './images/playerCar.png'
  scoreBg = new Image()
  scoreBg.src = './images/car3.png'

  //заполняем массив врагов первый раз
  for (let i = 0; i < 3; i++) {
    imgCars[i] = new Image()
    imgCars[i].src = `./images/car${rndInt(1, 7)}.png`
    carsSpeed[i] = rndInt(1, 4) + rndInt(1, 9) / 10
  }

  // Music block
  let music = new Audio('./audio/music.mp3')
  let soundAmbient = new Audio('./audio/engineAmbient.mp3')
  soundAmbient.loop = true
  soundAmbient.volume = 1
  soundAmbient.play()

  soundEngine.volume = .1

  // music.loop = true
  // music.volume = 0.2
  // music.play()

  Render()
}


function Render() {

  //Рисуем дорогу и машину игрока
  ctx.drawImage(imgRoad, 0, 0)
  ctx.drawImage(imgLine, 0, linePosY)

  linePosY >= 0 ? linePosY = -550 : linePosY += 2

  //Отрисовка врагов
  if (imgCars[0] != undefined) ctx.drawImage(imgCars[0], lines[0] - (imgCars[0].width / 2), enCarPosY1)
  if (imgCars[1] != undefined) ctx.drawImage(imgCars[1], lines[1] - (imgCars[1].width / 2), enCarPosY2)
  if (imgCars[2] != undefined) ctx.drawImage(imgCars[2], lines[2] - (imgCars[2].width / 2), enCarPosY3)

  //Доп инфа UI
  ctx.drawImage(plCarLife, 270, 30, 30, 60)
  ctx.drawImage(scoreBg, 15, 30, 40, 70)
  
  ctx.font = 'bold 25px sans-serif'
  ctx.fillStyle = '#AEDA35'
  ctx.textAlign = 'center'

  ctx.fillText(life, 270 + 15, 65)
  ctx.fillText(score, 35, 65)
  //Полоса инвиза
  if (invincible > 0) {
    ctx.fillStyle = '#333'
    ctx.fillRect(18, 13, (invincible / 1.7), 10)
    ctx.fillStyle = '#FF0'
    ctx.fillRect(15, 10, (invincible / 1.7), 10)
  }


  // Логика перемещения врагов
  if (enCarPosY1 < 560 && imgCars[0] != undefined) enCarPosY1 += carsSpeed[0]
  else {
    enCarPosY1 = -150
    createEnemy(imgCars[0], 0, enCarPosY1)
    score++
  }
  if (enCarPosY2 < 560 && imgCars[1] != undefined) enCarPosY2 += carsSpeed[1]
  else {
    enCarPosY2 = -150
    createEnemy(imgCars[1], 1, enCarPosY2)
    score++

  }
  if (enCarPosY3 < 560 && imgCars[2] != undefined) enCarPosY3 += carsSpeed[2]
  else {
    enCarPosY3 = -150
    createEnemy(imgCars[2], 2, enCarPosY3)
    score++

  }

  ctx.drawImage(plCar, carPosX, carPosY)

  //Обработка клавиш
  if (keyState.ArrowLeft && carPosX > 6) {
    soundEngine.play()
    carPosX -= 4
  }
  if (keyState.ArrowRight && carPosX < (314 - 52)) {
    soundEngine.play()
    carPosX += 4
  }
  if (keyState.ArrowUp && carPosY > 200) carPosY -= 4
  if (keyState.ArrowDown && carPosY < 440) carPosY += 3
  if (invincible > 0 && (keyState.Space || keyState.Control) ) {
    plCar.src = 'images/playerCarInv.png'
    invincible--
  }
  else { 
    plCar.src = 'images/playerCar.png' }
    if (invincible < 0) invincible = 0
  hit()
  if (life > 0) requestAnimationFrame(Render)
  else end()

  playerCar.show(ctx)
}


function rndInt(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1)
  return Math.round(rand)
}


function createEnemy(car, speed, posY) {
  car.src = `images/car${rndInt(1, 7)}.png`
  carsSpeed[speed] = rndInt(2, 4) + rndInt(1, 9) / 10
  posY = rndInt(-900, -150)
}


// Доделать ХИТ
function hit() {

  let en0X = lines[0] - (imgCars[0].width / 2)
  let en0wX = (lines[0] - (imgCars[0].width / 2)) + imgCars[0].width
  let car0PosHY = enCarPosY1 + imgCars[0].height

  let en1X = lines[1] - (imgCars[1].width / 2)
  let en1wX = (lines[1] - (imgCars[1].width / 2)) + imgCars[1].width
  let car1PosHY = enCarPosY2 + imgCars[1].height

  let en2X = lines[2] - (imgCars[2].width / 2)
  let en2wX = (lines[2] - (imgCars[2].width / 2)) + imgCars[2].width
  let car2PosHY = enCarPosY3 + imgCars[2].height

  if (keyState.Space || keyState.Control) { if (invincible > 0) return }
  if (carPosX > en0X && carPosX < en0wX && carPosY > enCarPosY1 && carPosY < car0PosHY ||
     carPosX + plCar.width > en0X && carPosX + plCar.width < en0wX &&
      carPosY > enCarPosY1 && carPosY < car0PosHY || carPosX > en0X &&
       carPosX < en0wX && carPosY + plCar.height > enCarPosY1 && carPosY + plCar.height < car0PosHY) {
    a++
    if (a > 10) {
      life--
      a = 0
      carPosX += rndInt(5, 30)
      carPosY += rndInt(5, 30)
    }
  }

  if (carPosX > en1X && carPosX < en1wX && carPosY > enCarPosY2 && carPosY < car1PosHY ||
     carPosX + plCar.width > en1X && carPosX + plCar.width < en1wX &&
      carPosY > enCarPosY2 && carPosY < car1PosHY || carPosX > en1X &&
       carPosX < en1wX && carPosY + plCar.height > enCarPosY2 && carPosY + plCar.height < car1PosHY) {
    b++
    if (b > 10) {
      life--
      b = 0
      carPosX += rndInt(5, 30)
      carPosY += rndInt(5, 30)

    }
  }

  if (carPosX > en2X && carPosX < en2wX && carPosY > enCarPosY3 && carPosY < car2PosHY ||
     carPosX + plCar.width > en2X && carPosX + plCar.width < en2wX &&
      carPosY > enCarPosY3 && carPosY < car2PosHY || carPosX > en2X &&
       carPosX < en2wX && carPosY + plCar.height > enCarPosY3 && carPosY + plCar.height < car2PosHY) {
    c++
    if (c > 10) {
      life--
      c = 0
      carPosX -= rndInt(5, 30)
      carPosY += rndInt(5, 30)

    }
  }
}


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function end() {
  life = 0
  console.log('u miss')
}







window.addEventListener('keydown', function (e) {
  if (e.key == 'ArrowLeft' || e.key == 'ArrowRight' ||
  e.key == 'ArrowUp' ||e.key == 'ArrowDown' || e.code == 'Space') e.preventDefault()
  keyState[e.key] = true
  keyState[e.code] = true
})
window.addEventListener('keyup', function (e) {
  keyState[e.key] = false
  keyState[e.code] = false
})

window.addEventListener('touchstart', keyHandlTouch)
window.addEventListener('touchend', function () {
  keyState.ArrowLeft = false
  keyState.ArrowRight = false
})


/* function keyHandl(ev) {
  console.log(ev)
  if (keyState.ArrowLeft && carPosX > 6) {
    soundEngine.play()
    carPosX -= 9
  }
  if (ev.key == 'ArrowRight' && carPosX < (314 - 52)) {
    soundEngine.play()
    carPosX += 9
  }
  if (ev.key == 'ArrowUp' && carPosY > 200)  carPosY -= 9
  if (ev.key == 'ArrowDown' && carPosY < 440) carPosY += 9
}
 */

function keyHandlTouch(ev) {
  if (ev.touches[0].clientX < (window.innerWidth / 2)) keyState.ArrowLeft = true
  if (ev.touches[0].clientX > (window.innerWidth / 2)) keyState.ArrowRight = true
}