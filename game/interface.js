'use strict';

export default class Interface {

    constructor(highScores) {
        this.score = document.getElementById("score");
        this.level = document.getElementById("level");
        this.gameOver = document.getElementById("gameOver");
        this.pauseScreen = document.getElementById("isPaused");
        this.highScoresTable = document.getElementById("highScores");
        this.leaderForm = document.getElementById("leaderForm");
        this.highScores = highScores;
    }

    togglePause(isPaused) {
        if (isPaused) {
            this.pauseScreen.classList.remove("invisible");
        } else {
            this.pauseScreen.classList.add("invisible");
        }
    }

    setLevel(level) {
        this.level.innerText = "Level "+level;
    }

    setScore(score) {
        this.score.innerText = "Score " +score;
    }


    showGameOver() {
        console.log(this.gameOver.classList);
        this.gameOver.classList.remove("invisible");
        console.log(this.gameOver.classList);

    }

    hideGameOver() {
        this.gameOver.classList.add("invisible");
    }

    showLeaderForm() {
        this.leaderForm.classList.remove("invisible");
    }

    hideLeaderForm() {
        this.leaderForm.classList.add("invisible");
    }

    showHighScores(){
        this.highScoresTable.classList.remove("invisible");
        this.highScoresTable.innerHTML = "";
        const score = this.highScores.getHighScores();
        for (let player of score) {
            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            const tdScore = document.createElement('td');
            tdName.innerText = player.name;
            tdScore.innerText = player.score;
            tr.appendChild(tdName);
            tr.appendChild(tdScore);
            this.highScoresTable.appendChild(tr);
        }
    }

    hideHighScores() {
        this.highScoresTable.classList.add("invisible");
    }


}