/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var msg = "Hello!";
alert(msg);
// Obiekt przechowujący dostępne style
var styles = {
  "Dark": "style/style1.css",
  "Light": "style/style2.css",
  "Blue": "style/style3.css"
};
// Funkcja zmieniająca styl strony
function changeStyle(styleName) {
  var existingLink = document.getElementById("dynamic-style");
  if (existingLink) {
    existingLink.href = styles[styleName];
  } else {
    var link = document.createElement("link");
    link.id = "dynamic-style";
    link.rel = "stylesheet";
    link.href = styles[styleName];
    document.head.appendChild(link);
  }
}
// Tworzenie dynamicznych przycisków do zmiany stylów
function createStyleButtons() {
  var container = document.createElement("div");
  container.id = "style-buttons";
  var _loop = function _loop(style) {
    var button = document.createElement("button");
    button.innerText = style;
    button.onclick = function () {
      return changeStyle(style);
    };
    container.appendChild(button);
  };
  for (var style in styles) {
    _loop(style);
  }
  document.body.prepend(container);
}
document.addEventListener("DOMContentLoaded", function () {
  createStyleButtons();
});
/******/ })()
;