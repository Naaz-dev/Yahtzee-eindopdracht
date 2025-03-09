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
var diceEls = document.querySelectorAll(".die");
var rollButton = document.getElementById("rollButton");
var endTurnButton = document.getElementById("endTurnButton");
var scoreCells = document.querySelectorAll("[data-score");

// dobbelsteen locken

for (var i = 0; i < diceEls.length; i++) {
    diceEls[i].addEventListener("click", function () {
        // getal data index naar nummer
        var index = parseInt(this.getAttribute("data-index"));
        toggleLock(index);
    });
}




rollButton.addEventListener("click", rollDice);


endTurnButton.addEventListener("click", endTurn);


for (let j = 0; j < scoreCells.length; j++) {
    scoreCells[j].addEventListener("click", function () {
        let player = parseInt(this.getAttribute("data-player"));
        let cat = this.getAttribute("data-score");
        //cel allen werken bij huidige speler
        if (player === currentPlayer && scores[currentPlayer][cat] === null && rollsleft < 3) {
            let sc = calculateScore(cat, dice);
            scores[currentPlayer][cat] = sc;
            this.classList.add("chosen");
        }
    })
}

// gooien functie
function rollDice() {
    if (rollsleft > 0)
        for (let i = 0; i < dice.length; i++) {
            if (!locked[i]) {
                dice[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
    rollsleft--;
    updateDiceUi();
}




//dobbelsteen locken of unlocken
function toggleLock(index) {
    //alleen locken als er al gegooid is
    if (rollsleft < 3) {
        locked[index] = !locked[index];
        updateDiceUi();
    }
}






function updateDiceUi() {
    for (let i = 0; i < dice.length; i++) {
        if (dice[i] === 0) {
            diceEls[i].textContent = "?";
        } else {
            dice[i].textContent = dice[i];
        }
        //css class "locked" als de dobbelsteen vergrendeld is
        if (locked[i]) {
            dice[i].classList.add("locked");
        } else {
            dice[i].classList.remove("locked");
        }
    }
}