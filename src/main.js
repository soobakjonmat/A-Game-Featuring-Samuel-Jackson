// https://github.com/Sopiro/Wakpking/ this game was inspired by this game

import { Game } from "./game.js"

let cvs = document.getElementById("cvs")
let ctx = cvs.getContext("2d")
let dotNum = 0
let loadingText = ""
let fontWidth = 0
let fontHeight = 20
ctx.font = `${fontHeight}px Roboto Condensed`
let loadingLoop = setInterval(showLoadingScreen, 1000)

function showLoadingScreen() {
    dotNum++
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    loadingText = `Loading${dotNum*"."}`
    fontWidth = ctx.measureText(loadingText).width
    ctx.fillText(loadingText, (cvs.width-fontWidth)/2, (cvs.height-fontHeight)/2)
    if (dotNum == 3) {
        dotNum = 0
    }
}


window.onload = function() {
    clearInterval(loadingLoop)
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    new Game().start()
}
