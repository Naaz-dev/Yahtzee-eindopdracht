var dice = [0, 0, 0, 0, 0];
var locked = [false, false, false, false, false];
var rollsleft = 3;




var message = document.getElementById("message");
var dice = document.querySelectorAll(".die");
var rollButton = document.getElementById("rollButton");
var endTurnButton = document.getElementById("endTurnButton");
var scoreCells = document.querySelectorAll("[data-score");