document.addEventListener('DOMContentLoaded', function() {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const score = document.getElementById("score");
    const gameOver = document.getElementById("gameOver");
    const tryAgainButton = document.getElementById("tryAgainButton");
    const startButton = document.getElementById("startButton");
    const pauseScreen = document.getElementById("isPaused");

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 40;
    const DOWN_KEY = 38;
    const SPACE_KEY = 32;


    let changingDirection = false;
    let snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150},
    ];

    let dx = 10;
    let dy = 0;
    let foodX;
    let foodY;
    let isPaused = false;

    document.addEventListener("keydown", function(event){
        togglePause(event);
        changeDirection(event);
    });

    tryAgainButton.addEventListener("click", function(event){
        event.preventDefault();
        gameStart();
    });

    startButton.addEventListener("click", function(){
        startButton.style.display = "none";
        gameStart();
    });

    function gameStart() {
        gameInit();
        main();
    }

    function main() {
        setTimeout(function onTick() {
            if (isPaused !== true) {
                changingDirection = false;
                if (isGameOver()) {
                    gameOver.style.display = "block";
                    return;
                }
                clearCanvas();
                advanceSnake();
                drawSnake();
                drawFood();
            }
            main();
        }, 100)}

    function gameInit() {
        snake = [
            {x: 150, y: 150},
            {x: 140, y: 150},
            {x: 130, y: 150},
            {x: 120, y: 150},
            {x: 110, y: 150},
        ];
        dx = 10;
        dy = 0;
        gameOver.style.display = "none";
        score.innerText = 0;
        createFood();
    }

    function togglePause(event) {
        if (event.keyCode === SPACE_KEY) {
            if (!isPaused) {
                isPaused = true;
                pauseScreen.style.display = "block";
            } else {
                isPaused = false;
                pauseScreen.style.display = "none";
            }
        }
    }

    function changeDirection(event) {
        if (changingDirection) {
            return;
        }
        changingDirection = true;

        const keyPressed = event.keyCode;
        if (keyPressed === LEFT_KEY && dx!==10) {
            dx = -10;
            dy = 0;
        }
        else if (keyPressed === RIGHT_KEY && dx!==-10) {
            dx = 10;
            dy = 0;
        }
        else if (keyPressed === UP_KEY && dy!==-10) {
            dx = 0;
            dy = 10;
        }
        else if (keyPressed === DOWN_KEY && dy!==10) {
            dx = 0;
            dy = -10;
        }

    }


    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnakePart(snakePart) {
        ctx.fillStyle = 'lightgreen';
        ctx.strokestyle = 'darkgreen';
        ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
        ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

    function drawSnake() {
        snake.forEach(function (snakePart) {
            drawSnakePart(snakePart);
        });
    }

    function advanceSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);
        /*check if we ate some food*/
        if (snake[0].x === foodX && snake[0].y === foodY) {
            addScore();
            createFood();
        } else {
            snake.pop();
        }
        clearCanvas();
        drawSnake(snake);
    }

    function randomTen(min, max) {
        return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }

    function createFood() {
        foodX = randomTen(0, canvas.width - 10);
        foodY = randomTen(0, canvas.height - 10);
        snake.forEach(function (part) {
            if (part.x === foodX && part.y === foodY)
                createFood();
        });
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.strokestyle = 'darkred';
        ctx.fillRect(foodX, foodY, 10, 10);
        ctx.strokeRect(foodX, foodY, 10, 10);
    }

    function addScore() {
        score.innerText = +score.innerText + 10;
    }

    function isGameOver() {
        for (let i = 4; i < snake.length; i++) {
            if (snake[0].x===snake[i].x && snake[0].y===snake[i].y) {
                return true;
            }
            if (snake[0].x < 0 || snake[0].x > canvas.width - 10 || snake[0].y < 0 || snake[0].y > canvas.height - 10) {
                return true;
            }
        }
    }
});