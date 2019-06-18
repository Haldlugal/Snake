'use strict';
import Snake from './snake.js';
import Interface from './interface.js';
import Screen from './screen.js';
import Food from './food.js';
import Highscores from './highscores.js';
import Config from './config.js';

export default class GameManager {

    constructor(container) {
        this.container = document.getElementById(container);
        this.container.innerHTML ="<div class='canvas-container'>" +
        "           <div class=\"statistics\">\n" +
            "            <div id=\"level\">Level</div>\n" +
            "            <div id=\"score\">Score</div>\n" +
            "        </div>\n" +
        "            <div class=\"invisible\" id=\"gameOver\">\n" +
            "            <p>GAME OVER</p>\n" +
            "           <button id=\"tryAgainButton\">Try again</button>\n" +
            "        </div>\n" +
            "        <div class=\"invisible\" id=\"isPaused\">\n" +
            "            PAUSE\n" +
            "            <p class=\"pause-text\">Press Space to continue</p>\n" +
            "        </div>\n" +
            "        <div id=\"startButton\">\n" +
            "            Start Game\n" +
            "        </div>\n" +
            "        <table class=\"invisible\" id=\"highScores\">\n" +
            "            </table>\n" +
        "            <form class=\"invisible\" id=\"leaderForm\">\n" +
            "            <h3>New highscore!</h3>\n" +
            "        <p>Enter your name</p>\n" +
            "        <input id=\"playerName\" type=\"text\" minlength=\"3\" maxlength=\"12\" required>\n" +
            "        <button type=\"submit\">Submit</button><button id=\"leaderCancelButton\">Cancel</button>\n" +
            "        </form>\n" +
            "        <canvas id=\"canvas\" width=\"900\" height=\"600\"></canvas>" +
                    "</div>";

        this.canvas = this.container.querySelector("#canvas");
        this.tryAgainButton = this.container.querySelector("#tryAgainButton");
        this.startButton = this.container.querySelector("#startButton");
        this.leaderForm = this.container.querySelector("#leaderForm");
        this.leaderFormCancelButton = this.container.querySelector("#leaderCancelButton");
        this.playerName = this.leaderForm.querySelector("#playerName");

        this.maxX = this.canvas.width - Config.measurementUnits;
        this.maxY = this.canvas.height - Config.measurementUnits;

        this.highscores = new Highscores();
        this.gameInterface = new Interface(this.highscores);
        this.screen = new Screen(this.canvas);
        this.food = new Food();

        this.setButtonHandlers();
    }

    gameStart() {
        this.gameInit();
        this.main();
    }

    gameInit() {
        this.snake = new Snake({snakeHead: {x: 150, y: 150}, direction: "right", length: 7});
        this.subscribeSnakeEvents();
        this.gameSpeed = Config.initialSpeed;
        this.score = 0;
        this.level = 0;
        this.isPaused = false;
        this.gameOver = false;
        this.gameInterface.setLevel(this.level);
        this.gameInterface.togglePause(this.isPaused);
        this.gameInterface.hideGameOver();
        this.gameInterface.hideHighScores();
        this.gameInterface.setScore(0);
        this.createFood(this.snake);
    }

    setButtonHandlers() {
        document.addEventListener("keydown", (event) => {
            this.control(event);
        });

        this.tryAgainButton.addEventListener("click", () => {
            this.gameStart();
        });

        this.startButton.addEventListener("click", () => {
            this.startButton.style.display = "none";
            this.gameStart();
        });

        this.leaderForm.addEventListener("submit", (event) => {
            event.preventDefault();

            this.highscores.setHighScores(this.playerName.value, this.score);
            this.gameInterface.hideLeaderForm();
            this.gameInterface.showGameOver();
            this.gameInterface.hideHighScores();
            this.gameInterface.showHighScores();
        });

        this.leaderFormCancelButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.gameInterface.hideLeaderForm();
            this.gameInterface.showGameOver();
        });

        this.playerName.addEventListener("keypress",(event) => {
            if (event.code === 'Space') {
                event.preventDefault();
            }
        });

    }

    stopGame() {
        this.gameOver = true;
        this.unsubscribeSnakeEvents();
        this.screen.clear();
        if (this.highscores.isHighScore(this.score)){
            this.gameInterface.showLeaderForm();
            this.gameInterface.showHighScores();
        } else {
            this.gameInterface.showGameOver();
            this.gameInterface.showHighScores();
        }
    }

    main() {
        this.gameInterval = setInterval(() => {
            this.gameTick();
        }, this.gameSpeed);
    }

    gameTick() {
        if (this.gameOver) {
            clearInterval(this.gameInterval);
        }
        this.screen.clear();
        if (!this.isPaused && !this.gameOver) {
            if (this.ateFood(this.snake, this.food)) {
                this.snake.grow();
            }
            this.snake.move();
            if (this.crossedBorder()) {
                this.snake.crossedBorder();
            } else if (this.crossedItself()){
                this.snake.crossedItself();
            }

            this.screen.draw(this.snake.getPixels().concat(this.food.getPixels()));
        }
    }

    subscribeSnakeEvents() {
        this.snakeEvents = [];
        this.snakeEvents.push(this.snake.subscribe("ateFood", () => {
            this.score += Config.scoreGained;
            if (this.score % Config.levelUp === 0) {
                this.level++;
                this.gameInterface.setLevel(this.level);
                this.gameSpeed -= Config.speedUp;
                clearInterval(this.gameInterval);
                this.main();
            }
            this.createFood(this.snake);
            this.gameInterface.setScore(this.score);
        }));

        this.snakeEvents.push(this.snake.subscribe("crossedItself", () => {
            this.stopGame();
        }));

        this.snakeEvents.push(this.snake.subscribe("crossedBorder", () => {
            this.stopGame();
        }));
    }

    unsubscribeSnakeEvents() {
        for(let snakeEvent of this.snakeEvents) {
            snakeEvent.unsubscribe();
        }
        this.snakeEvents = [];
    }

    control(event) {
        if (!this.gameOver) {
            if (event.code === 'Space') {
                this.isPaused = !this.isPaused;
                this.gameInterface.togglePause(this.isPaused);
            } else if (!this.isPaused) {
                const keyPressed = event.code;
                switch (keyPressed) {
                    case "ArrowUp":
                        this.snake.changeDirection("up");
                        break;
                    case "ArrowDown":
                        this.snake.changeDirection("down");
                        break;
                    case "ArrowLeft":
                        this.snake.changeDirection("left");
                        break;
                    case "ArrowRight":
                        this.snake.changeDirection("right");
                        break;
                    default:
                        break;
                }
            }
        }
    }

    ateFood(snake, food) {
        return snake.snakeSegments[0].x >= food.x && snake.snakeSegments[0].x <= (food.x+(Config.measurementUnits -1)) && snake.snakeSegments[0].y >= food.y && snake.snakeSegments[0].y <=(food.y+Config.measurementUnits-1);
    }

    createFood(snake) {
        const x = this.random(0, this.maxX);
        const y = this.random(0, this.maxY);
        snake.snakeSegments.forEach((part) => {
            if (part.x === x && part.y === y){
                this.createFood(snake);
            }
            else {
                this.food.setCoords(x,y);
            }
        });
    }

    random(min, max) {
        return Math.round((Math.random() * (max-min) + min) / Config.measurementUnits) * Config.measurementUnits;
    }

    crossedItself() {
        for (let i = 4; i < this.snake.snakeSegments.length; i++) {
            if (this.snake.snakeSegments[0].x === this.snake.snakeSegments[i].x && this.snake.snakeSegments[0].y === this.snake.snakeSegments[i].y) {
                return true;
            }
        }
    }

    crossedBorder() {
        for (let i = 4; i < this.snake.snakeSegments.length; i++) {
            if (this.snake.snakeSegments[0].x < 0 || this.snake.snakeSegments[0].x > this.maxX || this.snake.snakeSegments[0].y < 0 || this.snake.snakeSegments[0].y > this.maxY) {
                return true;
            }
        }
    }
}