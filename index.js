
// The level map is 16 by 16 tiles; each tile is 8x8 px
const level = new Array(16 * 16)
const canvas = document.getElementById("viewport")

// Everything is scaled by a factor of 4
const scale = 4

const v = canvas.getContext("2d")

const mower = new Image()
const levelSpriteSheet = new Image()

window.debugPosition = false

const player = {
    x: 0,
    y: 0,
    vec: {
        x: 0,
        y: 0,
    }
}

function _loadResources() {
    const resourcesLoaded = new Array()

    resourcesLoaded.push(new Promise((resolve, reject) =>
        levelSpriteSheet.addEventListener("load", resolve, false)
    ))

    levelSpriteSheet.src = "sprites/level.png"

    resourcesLoaded.push(new Promise((resolve, reject) => {
        mower.addEventListener("load", resolve, false)
    }))

    mower.src = "sprites/mower.png"

    return resourcesLoaded
}

function drawLevel() {
    for (let i = 0; i < level.length; i++) {
        const level_y = Math.floor(i / 16)
        const level_x = Math.floor(i % 16)

        v.drawImage(levelSpriteSheet, level[i] * 8 * scale, 0, 8 * scale, 8 * scale, level_x * 8 * scale, level_y * 8 * scale, 8 * scale, 8 * scale)
    }
}

function _init() {
    for (let i = 0 ; i < 16 * 16; i++) {
        // 0 stands for a mowed tile
        level[i] = 1 + Math.floor(Math.random() * 8)
    }

    player.vec.x = Math.random()
    player.vec.y = Math.random()
}

let tile
function _update(delta) {
    if (player.x < 0 || player.x > canvas.width) {
        player.vec.x = -player.vec.x
    }

    if (player.y < 0 || player.y > canvas.height) {
        player.vec.y = -player.vec.y
    }

    player.x += player.vec.x
    player.y += player.vec.y

    tile_x = Math.round(player.x / scale / 8)
    tile_y = Math.round(player.y / scale / 8)

    tile = tile_y * 16 + tile_x

    document.getElementById("tile").innerText = tile

    level[tile] = 0
}

function _draw() {
    drawLevel()

    if (window.debugPosition) {
        v.strokeStyle = "red"
        v.strokeRect(tile_x * 8 * scale, tile_y * 8 * scale, 8 * scale, 8 * scale)
    }

    v.drawImage(mower, player.x, player.y)
}

let previousTimeStamp = 0
function __gameLoop(timeStamp){
    let delta = timeStamp - previousTimeStamp
    previousTimeStamp = timeStamp
    _update(delta)
    _draw()

    window.requestAnimationFrame(__gameLoop)
}

Promise.all(_loadResources()).then(() => {
    _init()
    window.requestAnimationFrame(__gameLoop)
})
