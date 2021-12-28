// https://www.fiftysounds.com/ have good sound effects
import { Constants } from "./constants.js";
class Image {
    image;
    constructor(src) {
        this.image = document.createElement("img");
        this.image.src = src;
    }
}
export let images = {
    sjhead: new Image("./images/sjhead.png"),
    gun: new Image("./images/gun.png"),
    angryTrollFace: new Image("./images/angryTrollFace.png"),
};
class Audio {
    audio;
    constructor(src) {
        this.audio = document.createElement("audio");
        this.audio.src = src;
    }
    start() {
        if (Constants.isMuted) {
            return;
        }
        this.audio.volume = Constants.sfxVolume;
        this.audio.currentTime = 0;
        this.audio.play();
    }
}
export let audios = {
    punch1: new Audio("./audios/punch1.mp3"),
    punch2: new Audio("./audios/punch2.mp3"),
    punch3: new Audio("./audios/punch3.mp3"),
    dash: new Audio("./audios/dash.mp3"),
    ultStart: new Audio("./audios/hold onto your butts.mp3"),
};
