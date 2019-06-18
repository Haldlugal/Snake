'use strict';

import Config from "./config.js";

export default class Snake {

    constructor(snakeInfo) {
        this.directions = [];
        for (let i=0; i<snakeInfo.length; i++) {
            this.directions[i] = snakeInfo.direction;
        }
        this.direction = snakeInfo.direction;
        this.length = snakeInfo.length;

        this.snakeSegments = [];
        this.snakeSegments[0] = snakeInfo.snakeHead;
        for (let i=1; i<snakeInfo.length; i++) {
            switch (this.directions[i-1]) {
                case "up":
                    this.snakeSegments.push({x:this.snakeSegments[i-1].x, y:this.snakeSegments[i-1].y+Config.measurementUnits});
                    break;
                case "down":
                    this.snakeSegments.push({x:this.snakeSegments[i-1].x, y:this.snakeSegments[i-1].y-Config.measurementUnits});
                    break;
                case "left":
                    this.snakeSegments.push({x:this.snakeSegments[i-1].x+Config.measurementUnits, y:this.snakeSegments[i-1].y});
                    break;
                case "right":
                    this.snakeSegments.push({x:this.snakeSegments[i-1].x-Config.measurementUnits, y:this.snakeSegments[i-1].y});
                    break;
            }
        }

        this.subscribers = [];
    }

    move() {
        this.directions.unshift(this.direction);

        if (this.directions.length > this.length) {
            this.directions.pop();
        }

        switch (this.directions[0]) {
            case "up":
                this.snakeSegments[0].y -= Config.measurementUnits;
                break;
            case "down":
                this.snakeSegments[0].y += Config.measurementUnits;
                break;
            case "left":
                this.snakeSegments[0].x -= Config.measurementUnits;
                break;
            case "right":
                this.snakeSegments[0].x+= Config.measurementUnits;
                break;
            default:
                break;
        }

        for (let i = 1; i < this.length; i++) {
            switch (this.directions[i-1]) {
                case "up":
                    this.snakeSegments[i].x = this.snakeSegments[i-1].x;
                    this.snakeSegments[i].y = this.snakeSegments[i-1].y + Config.measurementUnits;
                    break;
                case "down":
                    this.snakeSegments[i].x = this.snakeSegments[i-1].x;
                    this.snakeSegments[i].y = this.snakeSegments[i-1].y - Config.measurementUnits;
                    break;
                case "left":
                    this.snakeSegments[i].x = this.snakeSegments[i-1].x + Config.measurementUnits;
                    this.snakeSegments[i].y = this.snakeSegments[i-1].y;
                    break;
                case "right":
                    this.snakeSegments[i].x = this.snakeSegments[i-1].x - Config.measurementUnits;
                    this.snakeSegments[i].y = this.snakeSegments[i-1].y;
                    break;
            }
        }
    }

    crossedItself() {
        this.publish("crossedItself");
    }

    crossedBorder() {
        this.publish("crossedBorder");
    }
    grow() {
        this.publish("ateFood");
        this.length ++;
        this.snakeSegments.push({x: this.snakeSegments[0], y: this.snakeSegments[0]});
    }

    changeDirection(direction){
        switch(direction){
            case "up":
                if (this.direction!=="down") {
                    this.direction = "up";
                }

                break;
            case "down":
                if (this.direction!=="up") {
                    this.direction = "down";
                }
                break;
            case "left":
                if (this.direction!=="right") {
                    this.direction = "left";
                }
                break;
            case "right":
                if (this.direction!=="left") {
                    this.direction = "right";
                }
                break;
            default:
                break;
        }

    }
    getPixels(){
        const segments = [];
        for(let snakeSegment of this.snakeSegments) {
            segments.push({coords:snakeSegment, mainColor:"lightgreen", borderColor: "darkgreen"});
        }
        return segments;
    }

    subscribe(event, callback) {
        let index;
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        index = this.subscribers[event].push(callback) - 1;
        let self = this;
        return {
            unsubscribe() {
                self.subscribers[event].splice(index, 1);
            }
        };
    }

    publish(event, data) {
        if (!this.subscribers[event]) return;
        this.subscribers[event].forEach(subscriberCallback =>
            subscriberCallback(data));
    }


}