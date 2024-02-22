
const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

// Lay out map matrix
const map = [
    ['-','-','-','-','-','-','-','-','-','-','-'],
    ['-','.','.','.','.','.','.','.','.','.','-'],
    ['-','.','g','g','g','.','g','g','g','.','-'],
    ['-','.','g','g','g','.','g','g','g','.','-'],
    ['-','.','.','.','.','.','.','.','.','.','-'],
    ['-','.','g','.','.','r','.','.','g','.','-'],
    ['-','.','g','.','.','t','.','.','g','.','-'],
    ['-','.','.','.','.','.','.','.','.','.','-'],
    ['-','.','g','g','g','.','g','g','g','.','-'],
    ['-','.','g','g','g','.','g','g','g','.','-'],
    ['-','.','.','.','.','.','.','.','.','.','-'],
    ['-','-','-','-','-','-','-','-','-','-','-']
]


// All class starts here

// Boundary class: Outer grey areas
class Boundary{
    static width = 50
    static height = 50
    constructor({position}){
        this.position = position
        this.width = 50
        this.height = 50
    }
    draw(){
        c.fillStyle = 'grey'
        c.fillRect(this.position.x, this.position.y, this.width,
            this.height)
    }
}

// Obstacle class: green areas inside the game canvas
class Obstacle{
    constructor({position}){
        this.position = position
        this.width = 50
        this.height = 50
    }
    draw(){
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y, this.width,
            this.height)
    }
}

// HLine class: horizontal blue lines in the center of the canvas
class HLine{
    constructor({position}){
        this.position = position
        this.width = 20
        this.height = 5
    }
    draw(){
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width/2,
        this.height/2)
    }
}

// VLine class: vertical blue lines in the center of the canvas
class VLine{
    constructor({position}){
        this.position = position
        this.width = 5
        this.height = 20
    }
    draw(){
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width/2,
        this.height/2)
    }
}

// Pacman class: blue triangle on the bottom, the player
class Pacman{
    constructor({position}){
        this.position = position
    }
    draw(){
        let h = 25 * Math.cos(Math.PI / 6);
        c.beginPath();
        c.moveTo(15 + this.position.width, 35 + this.position.height);
        c.lineTo(35 + this.position.width, 35 + this.position.height);
        c.lineTo(25 + this.position.width, 35 - h +this.position.height);
        // the fill color
        c.fillStyle = "blue";
        c.fill();
        c.closePath();
    }
    update(){
        this.draw()
    }
}

// GhostR class: red ghost square. 
// velocity constructor is kept but not doing anything at the moment.
// Kept in the code because constant movement ghosts are possible to implement
class GhostR{
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity
        this.width = 25
        this.height = 25
    }
    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x+15, this.position.y+15, this.width,
            this.height)
    }
    update(){
        this.draw()
        //if we want ghosts to move:
        //this.position.x += this.velocity.x
        //this.position.y += this.velocity.y
    }
}

// GhostA class: aqua ghost square. 
// velocity constructor is kept but not doing anything at the moment.
// Kept in the code because constant movement ghosts are possible to implement
class GhostA{
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity
        this.width = 25
        this.height = 25
    }

    draw(){
        c.fillStyle = 'aqua'
        c.fillRect(this.position.x+15, this.position.y+15, this.width,
            this.height)
    }
    update(){
        this.draw()
        //this.position.x += this.velocity.x
        //this.position.y += this.velocity.y
    }
}

// Powerup class: the purple pellet on top left
class Powerup{
    constructor({position}){
        this.position = position
        this.radiu = 7
    }
    draw(){
        // a circle
        c.beginPath();
        c.arc(this.position.x+25, this.position.y+25, this.radiu, 0, Math.PI * 2)
        c.fillStyle = 'purple'
        c.fill()
        c.closePath()
    }
    update(){
        //update is called when eaten, remove it
        this.radiu = 0
        this.position.x = 0
        this.position.y = 0
    }
}   

// Pellet class: yellow pellets across the map
class Pellet{
    constructor({position}){
        this.position = position
        this.radiu = 7
    }

    draw(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radiu, 0, Math.PI * 2)
        c.fillStyle = '#cc9900'
        c.fill()
        c.closePath()
    }
}

// Initialize variables
const boundaries = []
const obstacles = []
const midline = []
var pellets = []
var ghostRed = 
    new GhostR({
        position:{
        x:250,
        y:250
    },
    velocity:{
        x:0,
        y:0
    }
})
var ghostAqua = 
    new GhostA({
        position:{
        x:250,
        y:300
    },
    velocity:{
        x:0,
        y:0
    }
})
var pacman = new Pacman({
    position:{
        width: 250,
        height:500
    }
})
var powerPellet = new Powerup({
    position:{
        x:50,
        y:50
    }
})
var score = document.createElement("div");
score.id = "score";
score.style.position = "absolute";
score.style.top = "15px";
score.style.left = "480px";
score.style.color = "white";
score.style.fontFamily = "Arial";
score.style.fontSize = "30px";
document.body.appendChild(score);
let currentScore = 0
score.innerText = currentScore

var gameover = document.createElement("div");
gameover.id = "gameover";
gameover.style.position = "absolute";
gameover.style.top = "220px";
gameover.style.left = "70px";
gameover.style.color = "black";
gameover.style.fontFamily = "Arial";
gameover.style.fontSize = "50px";
document.body.appendChild(gameover);

var timer = document.createElement("div");
timer.id = "timer";
timer.style.position = "absolute";
timer.style.top = "15px";
timer.style.left = "60px";
timer.style.color = "white";
timer.style.fontFamily = "Arial";
timer.style.fontSize = "30px";
document.body.appendChild(timer);
var remainingSeconds = 60;
timer.innerText = remainingSeconds;
var timerInterval= setInterval(function () {
    remainingSeconds--;
}, 1000);

var paused = false;
var power = false

// Function: animate()
// Handles all the graphical updates for the game
function animate(){
    // if game is pause, this function wont run
    if (paused == false){
        requestAnimationFrame(animate)
        c.clearRect(0,0,canvas.width,canvas.height)

        // draw boundary and obstacles here
        boundaries.forEach((boundary)=> {
            boundary.draw()
        })
        obstacles.forEach((obs)=> {
            obs.draw()
        })
        midline.forEach((ml)=> {
            ml.draw()
        })

        // draw pellets here
        for(let i = pellets.length-1; 0 < i; i--){
            const pellet = pellets[i]
            pellet.draw()
            // if eaten
            if(pellet.position.x - 25 == pacman.position.width && pellet.position.y - 25 == pacman.position.height){
                pellets.splice(i,1)
                currentScore += 100
            }
        }

        // displater timer
        timer.innerText =  remainingSeconds;

        // update everything else
        pacman.update()
        ghostRed.update()
        ghostAqua.update()
        powerPellet.draw()

        // if aqua ghost hit pacman, lose 500 points
        if(pacman.position.width == ghostAqua.position.x && pacman.position.height == ghostAqua.position.y){
            ghostAqua = 
            new GhostA({
                position:{
                x:250,
                y:300
            },
            velocity:{
                x:0,
                y:0
            }
            })
            // check if power pellet is active
            if(power == false){
                currentScore -= 500
            }
            if(power == true){
                power = false
            }
        }

        // red ghost score penalty is less, due to smart AI movement
        if(pacman.position.width == ghostRed.position.x && pacman.position.height == ghostRed.position.y){
            ghostRed = 
            new GhostR({
                position:{
                x:250,
                y:250
            },
            velocity:{
                x:0,
                y:0
            }
            })
            if(power == false){
                currentScore -= 200
            }
            if(power == true){
                power = false
            }
        }

        // eat pellet
        if(pacman.position.width == powerPellet.position.x && pacman.position.height == powerPellet.position.y){
            powerPellet.update()
            power = true
        }

        // lose condition
        if(currentScore < 0){
            paused = true
            gameover.innerText = "Game Over \n Final Score: " + currentScore + "\nShift+R to restart"
        }
    
        // timer down to 0
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            paused = true
            gameover.innerText = "Game Over \n Final Score: " + currentScore + "\nShift+R to restart"
        }

        // all pellets eaten, win
        if(pellets.length == 1){
            paused = true
            currentScore = currentScore + (100 * remainingSeconds)
            gameover.innerText = "Game Over \n Final Score: " + currentScore + "\nShift+R to restart"
        }
    
        score.innerHTML = currentScore
    }
}

// start loop
animate()

// Listeners start here

// get rid of default arrow key browser movement
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

addEventListener('keydown', function(event) {
    if (event.shiftKey && event.key === 'R') {
      // Code to handle Shift + R key press
        resetAll()
        animate()
    }
});

// All other cases
// When an arrow key is pressed, a random movement is called for aqua ghost.
// red ghost will chase pacman
addEventListener('keydown',({key}) => {

    switch(key){
        case 'ArrowUp':
        // random to 8 allows diagnal movement. Original red ghost idea, but game still too easy.
        //var rand = Math.floor(Math.random() * 8);
        var rand1 = Math.floor(Math.random() * 4);
        if(paused == false){
            pacman.position.height -= 50
            chaseG(ghostRed, pacman)
            randomizeG(ghostAqua, rand1)
        }
        // if the check bound function returns false, pacman hit obstacle, move back.
        if(checkBound(pacman) == false){
            pacman.position.height += 50
        }
        break
        case'ArrowLeft':
        var rand1 = Math.floor(Math.random() * 4);
        if(paused == false){
            pacman.position.width -= 50
            chaseG(ghostRed, pacman)
            randomizeG(ghostAqua, rand1)
        }
        if(checkBound(pacman) == false){
            pacman.position.width += 50
        }
        break
        case'ArrowDown':
        var rand1 = Math.floor(Math.random() * 4);
        if(paused == false){
            pacman.position.height += 50
            chaseG(ghostRed, pacman)
            randomizeG(ghostAqua, rand1)
        }
        if(checkBound(pacman) == false){
            pacman.position.height -= 50
        }
        break
        case'ArrowRight':
        var rand1 = Math.floor(Math.random() * 4);
        if(paused == false){
            pacman.position.width += 50
            chaseG(ghostRed, pacman)
            randomizeG(ghostAqua, rand1)
        }
        if(checkBound(pacman) == false){
            pacman.position.width -= 50
        }

        // pause and resume
        break
        case'p':
        togglePause()
        break
        case'r':
        toggleStart()
        break
    }
})

// All helper functions start here

// ChaseG implements ghost AI movement.
// Calculates which direction pacman is, and move towards that direction
// Diagnal movement is allowed
function chaseG(objG, objP){
    if(objG.position.x == objP.position.width){
        if(objG.position.y < objP.position.height){
            objG.position.y += 50
            if(checkBoundG(objG) == false){
                objG.position.y -= 50
            }
        }
        if(objG.position.y > objP.position.height){
            objG.position.y -= 50
            if(checkBoundG(objG) == false){
                objG.position.y += 50
            }
        }
        else {
            return
        }
    }
    if(objG.position.y == objP.position.height){
        if(objG.position.x < objP.position.width){
            objG.position.x += 50
            if(checkBoundG(objG) == false){
                objG.position.x -= 50
            }
        }
        if(objG.position.x > objP.position.width){
            objG.position.x -= 50
            if(checkBoundG(objG) == false){
                objG.position.x += 50
            }
        }
        else {
            return
        }
    }
    if(objG.position.x < objP.position.width && objG.position.y < objP.position.height){
        objG.position.y += 50
        objG.position.x += 50
        if(checkBoundG(objG) == false){
            objG.position.y -= 50
            objG.position.x -= 50
        }
    }
    if(objG.position.x > objP.position.width && objG.position.y > objP.position.height){
        objG.position.y -= 50
        objG.position.x -= 50
        if(checkBoundG(objG) == false){
            objG.position.y += 50
            objG.position.x += 50
        }
    }
    if(objG.position.x < objP.position.width && objG.position.y > objP.position.height){
        objG.position.y -= 50
        objG.position.x += 50
        if(checkBoundG(objG) == false){
            objG.position.y += 50
            objG.position.x -= 50
        }
    }
    if(objG.position.x > objP.position.width && objG.position.y < objP.position.height){
        objG.position.y += 50
        objG.position.x -= 50
        if(checkBoundG(objG) == false){
            objG.position.y -= 50
            objG.position.x += 50
        }
    }
    else{
        return
    }
}

// randomizeG implements random ghost movement
function randomizeG(obj, rand){

    // case 0-3 are normal 4 directional movements
    if(rand == 0){
        obj.position.y -= 50
        if(checkBoundG(obj) == false){
            obj.position.y += 50
        }
    }
    if(rand == 1){
        obj.position.y += 50
        if(checkBoundG(obj) == false){
            obj.position.y -= 50
        }

    }
    if(rand == 2){
        obj.position.x -= 50
        if(checkBoundG(obj) == false){
            obj.position.x += 50
        }

    }
    if(rand == 3){
        obj.position.x += 50
        if(checkBoundG(obj) == false){
            obj.position.x -= 50
        }
    }

    // case 4-7 are diagnal movements
    // originally implemented for red ghost, not used by any ghost currently
    if(rand == 4){
        obj.position.y -= 50
        obj.position.x -= 50
        if(checkBoundG(obj) == false){
            obj.position.y += 50
            obj.position.x += 50
        }
    }
    if(rand == 5){
        obj.position.y += 50
        obj.position.x += 50
        if(checkBoundG(obj) == false){
            obj.position.y -= 50
            obj.position.x -= 50
        }

    }
    if(rand == 6){
        obj.position.y -= 50
        obj.position.x += 50
        if(checkBoundG(obj) == false){
            obj.position.y += 50
            obj.position.x -= 50
        }

    }
    if(rand == 7){
        obj.position.y += 50
        obj.position.x -= 50
        if(checkBoundG(obj) == false){
            obj.position.y -= 50
            obj.position.x += 50
        }
    }

}

// functions to pause/resume the game
function togglePause()
{
    paused = true
    animate()
}
function toggleStart()
{
    paused = false
    animate()
}

// full restart function
function resetAll(){
    paused = false
    ghostRed = 
    new GhostR({
        position:{
        x:250,
        y:250
    },
    velocity:{
        x:0,
        y:0
    }
    })
    ghostAqua = 
    new GhostA({
        position:{
        x:250,
        y:300
    },
    velocity:{
        x:0,
        y:0
    }
    })
    pacman = new Pacman({
        position:{
            width: 250,
            height:500
        }
    })
    remainingSeconds = 60;
    currentScore = 0
    pellets = []
    map.forEach((row, i) => {
        row.forEach((symbol, j) => {
            switch(symbol) {
                case '.':
                    pellets.push(
                        new Pellet({
                            position:{
                                x:50 *j + 25,
                                y:50 *i + 25
                            }
                        })
                    )
                    break;    
                }
        
            })
        })
    gameover.innerText = ""
    powerPellet = new Powerup({
        position:{
            x:50,
            y:50
        }
    })
}

// function to check if the pacman is inside the inaccessible area
// returns true if pacman is in valid area
// returns false if not in valid area
function checkBound(obj){
    if (obj.position.height == 50 || obj.position.height == 500 || obj.position.height == 200 || obj.position.height == 350){
        if(obj.position.width <= 0 || obj.position.width > 450 ){
            return false
        }
        return true
    }
    if (obj.position.width == 50 || obj.position.width == 450){
        if(obj.position.height <= 0 || obj.position.height > 450 ){
            return false
        }
        return true
    }
    if(obj.position.height == 100 || obj.position.height == 150 || obj.position.height == 400 || obj.position.height == 450){
        if(obj.position.width == 0 || obj.position.width == 100 || obj.position.width == 150 ||
            obj.position.width == 200 || obj.position.width == 300 || obj.position.width == 350 ||
            obj.position.width == 400 || obj.position.width == 500){
            return false
        }
        return true
    }
    if (obj.position.height == 250 || obj.position.height == 300){
        if(obj.position.width == 0 || obj.position.width == 100 || obj.position.width == 250 ||
            obj.position.width == 400 || obj.position.width == 500){
                return false
        }
        return true
    }
    return false

}

// function to check if the ghost is inside the inaccessible area
// slight twist compare to pacman function: middle blue lined area
function checkBoundG(obj){
    if (obj.position.x == 0 || obj.position.x == 500 || obj.position.y == 0 || obj.position.y == 550){
        return false
    }
    if(obj.position.y == 100 || obj.position.y == 150 || obj.position.y == 400 || obj.position.y == 450){
        if(obj.position.x == 50 || obj.position.x == 250 || obj.position.x == 450){
            return true
        }
        return false
    }
    if(obj.position.y == 250 || obj.position.y == 300){
        if(obj.position.x == 50 || obj.position.x == 150 || obj.position.x == 200 ||
            obj.position.x == 250 || obj.position.x == 300 || obj.position.x == 350||
            obj.position.x == 450){
            return true
        }
        return false
    }
    return true

}

// draw the map according to the matrix
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch(symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position:{
                            x:Boundary.width *j,
                            y:Boundary.height *i
                        }
                    })
                )
                break;
            case 'g':
                obstacles.push(
                    new Obstacle({
                        position:{
                            x:50 *j,
                            y:50 *i
                        }
                    })
                )
                break;
            case '.':
                pellets.push(
                    new Pellet({
                        position:{
                            x:50 *j + 25,
                            y:50 *i + 25
                        }
                    })
                )
                break;

            case 'r':

                midline.push(
                    new HLine({
                        position:{
                            x:50.5 *j,
                            y:50 *i
                        }
                    })
                )
                midline.push(
                    new HLine({
                        position:{
                            x:54.5 *j,
                            y:50 *i
                        }
                    })
                )
                midline.push(
                    new HLine({
                        position:{
                            x:58.5 *j,
                            y:50 *i
                        }
                    })
                )
                midline.push(
                    new VLine({
                        position:{
                            x:50 *j,
                            y:51 *i
                        }
                    })
                )
                midline.push(
                    new VLine({
                        position:{
                            x:50 *j,
                            y:55 *i
                        }
                    })
                )
                midline.push(
                    new VLine({
                        position:{
                            x:50 *j,
                            y:59 *i
                        }
                    })
                )
                midline.push(
                    new VLine({
                        position:{
                            x:60 *j,
                            y:51 *i
                        }
                    })
                )
                midline.push(
                    new VLine({
                        position:{
                            x:60 *j,
                            y:55 *i
                        }
                    })
                )
                midline.push(
                    new VLine({
                        position:{
                            x:60 *j,
                            y:59 *i
                        }
                    })
                )

                break;
            case 't':
                midline.push(
                    new HLine({
                        position:{
                            x:50.5 *j,
                            y:60 *i
                        }
                    })
                )
                midline.push(
                    new HLine({
                        position:{
                            x:54.5 *j,
                            y:60 *i
                        }
                    })
                )
                midline.push(
                    new HLine({
                        position:{
                            x:58.5 *j,
                            y:60 *i
                        }
                    })
                )
                midline.push(
                    new VLine({
                        position:{
                            x:50 *j,
                            y:52 *i
                        }
                    })
                )
                midline.push(
                    new VLine({
                        position:{
                            x:50 *j,
                            y:55.5 *i
                        }
                    })
                )
                midline.push(
                    new VLine({
                        position:{
                            x:50 *j,
                            y:58.5 *i
                        }
                    })
                )
                midline.push(
                    new VLine({
                        position:{
                            x:60 *j,
                            y:52 *i
                        }
                    })
                )
                midline.push(
                    new VLine({
                        position:{
                            x:60 *j,
                            y:55.5 *i
                        }
                    })
                )
                midline.push(
                    new VLine({
                        position:{
                            x:60 *j,
                            y:58.5 *i
                        }
                    })
                )
                break;    
        }
    })
})
