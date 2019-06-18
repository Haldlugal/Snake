'use strict';
export default class Food {

    setCoords(x,y){
        this.x = x;
        this.y = y;
    }

    getPixels() {
        return ({coords:{x:this.x, y:this.y}, mainColor: "red", borderColor: "black"});
    }
}