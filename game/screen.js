'use strict';

import Config from "./config.js";

export default class Screen {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(squares) {
        for (let square of squares) {
            this.ctx.fillStyle = square.mainColor;
            this.ctx.strokeStyle = square.borderColor;
            this.ctx.fillRect(square.coords.x, square.coords.y, Config.measurementUnits, Config.measurementUnits);
            this.ctx.strokeRect(square.coords.x, square.coords.y, Config.measurementUnits, Config.measurementUnits);
        }
    }
}