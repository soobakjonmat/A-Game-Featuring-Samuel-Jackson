// https://www.fiftysounds.com/ have good sound effects

import { Constants } from "./constants.js"

export let images = {};
export let audios = {};

images.sjhead = new Image()
images.sjhead.src = "./images/SJhead.png"

images.gun = new Image()
images.gun.src = "./images/gun.png"

images.angryTrollFace = new Image()
images.angryTrollFace.src = "./images/angryTrollFace.png"

audios.punch1 = new Audio()
audios.punch1.src = "./audios/punch1.mp3"
audios.punch1.start = function () {
    if (Constants.isMuted) {
        return
    }
    audios.punch1.volume = Constants.sfxVolume;
    audios.punch1.currentTime = 0;
    audios.punch1.play();
};

audios.punch2 = new Audio()
audios.punch2.src = "./audios/punch2.mp3"
audios.punch2.start = function () {
    if (Constants.isMuted) {
        return
    }
    audios.punch2.volume = Constants.sfxVolume;
    audios.punch2.currentTime = 0;
    audios.punch2.play();
};

audios.punch3 = new Audio()
audios.punch3.src = "./audios/punch3.mp3"
audios.punch3.start = function () {
    if (Constants.isMuted) {
        return
    }
    audios.punch3.volume = Constants.sfxVolume;
    audios.punch3.currentTime = 0;
    audios.punch3.play();
};

audios.dash = new Audio()
audios.dash.src = "./audios/dash.mp3"
audios.dash.start = function () {
    if (Constants.isMuted) {
        return
    }
    audios.dash.volume = Constants.sfxVolume;
    audios.dash.currentTime = 0;
    audios.dash.play();
};

audios.ultStart = new Audio()
audios.ultStart.src = "./audios/hold onto your butts.mp3"
audios.ultStart.start = function () {
    if (Constants.isMuted) {
        return
    }
    audios.ultStart.volume = Constants.sfxVolume;
    audios.ultStart.currentTime = 0;
    audios.ultStart.play();
};
