// https://github.com/Sopiro/Wakpking/ this game was inspired by this game

import { Game } from "./game.js"

let cvs = document.getElementById("cvs")
let ctx = cvs.getContext("2d")
let dotNum = 0
let loadingText = ""
let textWidth = 0
let textHeight = 20
ctx.font = `${textHeight}px Roboto Condensed`
let loadingLoop = setInterval(showLoadingScreen, 500)

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

window.onload = function() {
    clearInterval(loadingLoop)
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    new Game().start()
}
