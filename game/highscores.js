'use strict';

import Config from "./config.js";

export default class Highscores {

    getHighScores(){
        const highScores = this.getCookie("highScores");
        if (highScores === '') {
            return new Array(0);
        }
        else {
            return JSON.parse(highScores);
        }

    }

    setHighScores(name, score) {
        const currentHighScores = this.getHighScores();
        if (currentHighScores.length < Config.HIGHSCORES_COUNT) {
            currentHighScores.push({name: name, score:score});
        } else {
            currentHighScores.sort(this.compare);
            if (score>=currentHighScores[currentHighScores.length-1].score) {
                currentHighScores.pop();
                currentHighScores.unshift({name: name, score: score});
            }
        }
        currentHighScores.sort(this.compare);
        const json_str = JSON.stringify(currentHighScores);
        this.setCookie("highScores", json_str);
    }

    setCookie(name, value) {
        document.cookie = name + "=" + value + ";";
    }

    getCookie(cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    compare(a,b) {
        if (b.score < a.score)
            return -1;
        if (b.score > a.score)
            return 1;
        return 0;
    }

    isHighScore(score) {
        const highScores = this.getHighScores();
        if (highScores.length < Config.HIGHSCORES_COUNT ) {
            return true;
        } else {
            return score >= highScores[highScores.length - 1].score;
        }
    }
}