const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const ballRadius = 10;

const rectWidth = 40;
const rectHeight = 40;

const rectAmount = 30;

var rects = [];

var speed_x = 0;
var speed_y = 0;

var accel_x = 0;
var accel_y = 0;

const decel = 0.05;

var Keys = {
    up: false,
    down: false,
    left: false,
    right: false
};



var x = gameBoard.width/2;
var y = gameBoard.height/2;

var running = true;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function generateRects() {
    for (var i = 0; i < rectAmount; i++) {

        const randomNum = Math.random(50, 100) * 50;

        rects.push({
            x: Math.random() * window.innerWidth,
            y: 0,
            width: rectWidth,
            height: rectHeight,
            color: "red",
            speed: 1 + Math.random() * 0.5
        });
        console.log("RECT GENERATED: " + rects[i]);
    }
}

function checkBallCollision() {
    /*
    if (x+speed_x > gameBoard.width - ballRadius || x+speed_x < ballRadius) {
        speed_x = -speed_x;
        console.log("OUT OF BOUNDS (width)");
    }
    if (y+speed_y > gameBoard.height - ballRadius || y+speed_y < ballRadius) {
        speed_y = -speed_y;
        console.log("OUT OF BOUNDS (height)");
    }
    */

    if (x+accel_x > gameBoard.width - ballRadius || x+accel_x < ballRadius) {
        accel_x = -accel_x;
        console.log("OUT OF BOUNDS (width)");
    }
    if (y+accel_y > gameBoard.height - ballRadius || y+accel_y < ballRadius) {
        accel_y = -accel_y;
        console.log("OUT OF BOUNDS (height)");
    }
    for (let i=0; i<rects.length; i++) {
        let rect = rects[i];
        if (x+ballRadius > rect.x && x-ballRadius < rect.x+rectWidth && y+ballRadius > rect.y && y-ballRadius < rect.y+rectWidth) {
            accel_x = -accel_x;
            accel_y = -accel_y;
            running = false;
        }
    }
}

function accelerate(amount) {
    if (Keys.up) {
        accel_y-=amount;
    }
    else if (Keys.down) {  // both up and down does not work so check excl.
        accel_y+=amount;
    }
    
    if (Keys.left) {
        accel_x-=amount;
    }
    else if (Keys.right) {
        accel_x+=amount;
    }
}

window.onkeydown = function(evt) {
    var keyCode = evt.keyCode;
    evt.preventDefault();

    if      (keyCode === 37) {Keys.left = true;}
    else if (keyCode === 38) {Keys.up = true;}
    else if (keyCode === 39) {Keys.right = true;}
    else if (keyCode === 40) {Keys.down = true;}
}

window.onkeyup = function(evt) {
    var keyCode = evt.keyCode;
    evt.preventDefault();

    if      (keyCode === 37) {Keys.left = false;}
    else if (keyCode === 38) {Keys.up = false;}
    else if (keyCode === 39) {Keys.right = false;}
    else if (keyCode === 40) {Keys.down = false;}
}



function mainloop() {
    if (running) {
        ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);

        for (let i=0; i<rects.length; i++) {
            let rectangle = rects[i];
            rectangle.y += rectangle.speed;
            if (rectangle.y > ctx.canvas.height) {
                rectangle.y = 0;
                rectangle.x = Math.random() * window.innerWidth;
                rectangle.speed += Math.random()/4;
            }

            ctx.fillStyle = rectangle.color;
            ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        }

        drawBall();

        checkBallCollision();

        accelerate(0.2);

        x += accel_x;
        y += accel_y;
        

        /*

        speed_x += accel_x;
        speed_y += accel_y;
        x += speed_x;
        y += speed_y;

        */

        if (accel_x<0) {accel_x+=decel;} else if (accel_x>0) {accel_x-=decel;}
        if (accel_y<0) {accel_y+=decel;} else if (accel_y>0) {accel_y-=decel;}
    }
}

generateRects();
setInterval(mainloop, 10);