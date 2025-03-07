var dice = [0, 0, 0, 0, 0];
var locked = [false, false, false, false, false];
var rollsleft = 3;
var currentPlayer = 1;

var scores = {
    1: {
        ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null,
        threeKind: null, fourKind: null, fullHouse: null, smallStraight: null,
        largeStraight: null, chance: null, yahtzee: null, sum: 0, bonus: 0, total: 0
    },
    2: {
        ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null,
        threeKind: null, fourKind: null, fullHouse: null, smallStraight: null,
        largeStraight: null, chance: null, yahtzee: null, sum: 0, bonus: 0, total: 0
    }
};


var message = document.getElementById("message");
var dice = document.querySelectorAll(".die");
var rollButton = document.getElementById("rollButton");
var endTurnButton = document.getElementById("endTurnButton");
var scoreCells = document.querySelectorAll("[data-score");