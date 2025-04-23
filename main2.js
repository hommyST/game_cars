const choosePlayerElement = document.querySelector('.choose_player')
/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas1')
const ctx = canvas.getContext('2d')
const lines = [56, 161, 264]

const player = new Player()
let loop = true

let linePosY = -550

let imgLine = new Image()
let imgRoad = new Image()

const enemies = []
let enemyAddCounter = 0


void function setup() {
  canvas.width = 320
  canvas.height = 550

  const playerImage = new Image()
  // playerImage.src = './images/playerCar.png'
  playerImage.src = './images/playerCar4.png'
  // playerImage.src = './images/car4.png'

  player.car = new Car(132, 440, playerImage, 3)

  imgLine.src = './images/line.png'
  imgRoad.src = './images/road.png'

  addEnemy(0)
  addEnemy(1)
  addEnemy(2)
  draw()
  fillPlayerChoices()
}()


function draw() {
  background()

  // Показываем и двигаем врагов
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i]

    enemy.show(ctx)
    enemy.moveDown()


    if (enemy.y > canvas.height) {
      player.score += 10
      enemies.splice(i, 1)
    }
  }

  if (player.car.isInvincible === false && player.isHitFrame === false) {
    for (const enemy of enemies) {
      if (enemy.hit(player.car)) {
        player.isHitFrame = true
        player.life -= 10
        player.car.x += randomInt(-20, 20)
        break
      }

      // TODO вынести из этого ИФА
      for (const other of enemies) {
        if (other === enemy) continue
        if (other.hit(enemy)) {
          other.y -= other.h * 0.5
          enemy.y += enemy.h * 0.8
        }
      }
    }
  }

  if (player.isHitFrame) {
    player.car.isInvincible = true
  }


  // Добавляем врагов
  // todo подумать как по другому добавлять (поинетреснее)
  if (enemyAddCounter > 100 && Math.random() < 0.6) {
    enemyAddCounter = 0

    let rnd = Math.random()
    if (rnd > 0.66) {
      addEnemy()
    } else if (rnd > 0.33) {
      addEnemy(0)
      addEnemy(2)
    } else {
      addEnemy(0)
      addEnemy(1)
      addEnemy(2)
    }

  }

  enemyAddCounter++

  player.car.show(ctx)
  player.update(canvas)

  showUI()

  if (player.life <= 0) {
    loop = false
  }

  if (loop) requestAnimationFrame(draw)
}


async function background() {
  if (linePosY >= 0) linePosY = -550
  else linePosY += 2

  ctx.drawImage(imgRoad, 0, 0)
  ctx.drawImage(imgLine, 0, linePosY)
}


async function addEnemy(lineCount = -1) {
  const img = new Image()
  img.src = `./images/car${randomInt(1, 7)}.png`
  await img.decode()

  let line
  if (lineCount >= 0) line = lines[lineCount]
  else line = lines.random()

  const x = line - img.width / 2
  const y = randomInt(-300, -100)

  const enemy = new Car(x, y, img, Math.random() * 5 + 3)
  enemies.push(enemy)
}

function showUI() {
  const TAU = 2 * Math.PI
  const invincibilityW = map(player.invincibility, 0, player.maxInvincibility, 0, 100)
  const lifeAngle = map(player.life, 0, 100, TAU - 0.1, 0.1)
  
  // invincibility progress bar
  ctx.fillStyle = '#757575'
  ctx.fillRect(10, 10, 100, 10)
  ctx.fillStyle = '#ffeb3b'
  ctx.fillRect(10, 10, invincibilityW, 10)

  // life progress
  const lifeColor = `hsl(${player.life}, 70%, 50%)`
  ctx.beginPath()
  ctx.fillStyle = '#757575'
  ctx.arc(30, 50, 20, 0, TAU)
  ctx.fill()

  ctx.beginPath()
  ctx.fillStyle = lifeColor
  ctx.arc(30, 50, 20, 0, lifeAngle, true)
  ctx.fill()

  // score
  ctx.beginPath()
  ctx.fillStyle = '#1b5e20d0'
  ctx.arc(canvas.width - 50, 40, 30, 0, TAU)
  ctx.fill()

  ctx.beginPath()
  ctx.fillStyle = '#e8f5e9'
  ctx.font = 'bold 15px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(player.score + '', canvas.width - 50, 40)
}

function fillPlayerChoices() {
  for (let i = 1; i <= 4; i++) {
    const num = i === 1 ? '' : i
    const img = document.createElement('img')
    img.src = `./images/playerCar${num}.png`
    choosePlayerElement.append(img)
  }

  choosePlayerElement.addEventListener('click', ({target}) => {
    if (!target.src) return
    const playerImage = new Image()
    playerImage.src = target.src
    player.car.image = playerImage
  })
}


