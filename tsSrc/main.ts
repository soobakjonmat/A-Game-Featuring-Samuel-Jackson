import { Game } from "./game.js"
import {keymap} from "./input.js"

let cvs = <HTMLCanvasElement> document.getElementById("cvs")
let ctx :CanvasRenderingContext2D = cvs.getContext("2d")
let dotNum :number = 0
let loadingText :string = ""
let textWidth :number = 0
let textHeight :number = 20
ctx.font = `${textHeight}px Roboto Condensed`

function showLoadingScreen() {
    dotNum++
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    loadingText = `Loading${".".repeat(dotNum)}`
    textWidth = ctx.measureText(loadingText).width
    ctx.fillText(loadingText, (cvs.width-textWidth)/2, (cvs.height-textHeight)/2)
    if (dotNum == 3) {
        dotNum = 0
    }
}

function appendKeyGuide() {
    let keyGuide = <HTMLDivElement> document.getElementById("keyGuide")
    for (let [key, value] of Object.entries(keymap)) {
        let guide = document.createElement("span")
        guide.innerHTML = `${key}: ${value}`
        keyGuide.appendChild(guide)
    }
}

appendKeyGuide()
let loadingLoop :number = setInterval(showLoadingScreen, 500)
window.onload = function() {
    clearInterval(loadingLoop)
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    new Game().start()
}
