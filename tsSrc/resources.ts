// https://www.fiftysounds.com/ have good sound effects

import { Constants } from "./constants.js"

class Img {
    image: HTMLImageElement
    constructor(src :string) {
        this.image = new Image()
        this.image.src = src
    }
}

export let images = {
    sjhead: new Img("./images/sjhead.png"),
    gun: new Img("./images/gun.png"),
    angryTrollFace: new Img("./images/angryTrollFace.png"),
}

class Aud {
    audio: HTMLAudioElement
    constructor(src :string) {
        this.audio = new Audio()
        this.audio.src = src
    }

    start() {
        if (Constants.isMuted) {
            return
        }
        this.audio.volume = Constants.sfxVolume
        this.audio.currentTime = 0
        this.audio.play()
    }
}

export let audios = {
    punch1: new Aud("./audios/punch1.mp3"),
    punch2: new Aud("./audios/punch2.mp3"),
    punch3: new Aud("./audios/punch3.mp3"),
    dash: new Aud("./audios/dash.mp3"),
    ultStart: new Aud("./audios/hold onto your butts.mp3"),
}
