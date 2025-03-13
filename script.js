let dice = [0, 0, 0, 0, 0];
let locked = [false, false, false, false, false];
let rollsLeft = 3;
let currentPlayer = 1;

let scores = {
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


let message = document.getElementById("message");
let diceEls = document.querySelectorAll(".die");
let rollButton = document.getElementById("rollButton");
let endTurnButton = document.getElementById("endTurnButton");
let scoreCells = document.querySelectorAll("[data-score]");

// dobbelsteen locken

for (let i = 0; i < diceEls.length; i++) {
    diceEls[i].addEventListener("click", function () {
        // getal data index naar nummer
        let index = parseInt(this.getAttribute("data-index"));
        toggleLock(index);
    });
}




rollButton.addEventListener("click", rollDice);


endTurnButton.addEventListener("click", endTurn);

//click-event aan elke scorecel zodat de speler een score kan kiezen
for (let j = 0; j < scoreCells.length; j++) {
    scoreCells[j].addEventListener("click", function () {
        let player = parseInt(this.getAttribute("data-player"));
        let cat = this.getAttribute("data-score");
        //cel allen werken bij huidige speler
        if (player === currentPlayer && scores[currentPlayer][cat] === null && rollsleft < 3) {
            let sc = calculateScore(cat, dice);
            scores[currentPlayer][cat] = sc;
            this.classList.add("chosen");
            updateUpperSection(currentPlayer);
            updateTotal(currentPlayer);
            updateScoreboard();
            endTurn();
        }
    });
}

// gooien functie
function rollDice() {
    if (rollsLeft > 0) {
        for (let i = 0; i < dice.length; i++) {
            if (!locked[i]) {
                dice[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        rollsLeft--;

        updateDiceUi();

        updateMessage("Speler " + currentPlayer + "heeft gegooid.(" + rollsleft + "worpen over) ");
        updateScoreboard();
    } else {
        updateMessage("Geen worpen meer. Kies een score.");
    }

}




//dobbelsteen locken of unlocken
function toggleLock(index) {
    //alleen locken als er al gegooid is
    if (rollsLeft < 3) {
        locked[index] = !locked[index];
        updateDiceUi();
    }
}


function endTurn() {
    dice = [0, 0, 0, 0, 0];
    locked = [false, false, false, false, false];
    rollsleft = 3;
    // Wissel van speler
    currentPlayer = (currentPlayer === 1) ? 2 : 1;
    updateDiceUi();
    updateMessage("Speler " + currentPlayer + "is aan de beurt. Klik op 'Gooien'.");
    updateScoreboard();
}





function updateDiceUi() {
    for (let i = 0; i < diceEls.length; i++) {
        if (dice[i] === 0) {
            diceEls[i].textContent = "?";
        } else {
            diceEls[i].textContent = dice[i];
        }
        //css class "locked" als de dobbelsteen vergrendeld is
        if (locked[i]) {
            diceEls[i].classList.add("locked");
        } else {
            diceEls[i].classList.remove("locked");
        }
    }
}



function updateScoreboard() {
    for (let i = 0; i < scoreCells.length; i++) {
        let cell = scoreCells[i];
        let player = parseInt(cell.getAttribute("data-player"));
        let cat = cell.getAttribute("data-score");
        // Als het de kolom is van de huidige speler en de score nog niet is ingevuld, toon dan de potentiële score
        if (player === currentPlayer && scores[currentPlayer][cat] === null &&
            rollsleft < 3 && cat !== "sum" && cat !== "bonus" && cat !== "total") {
            let potential = calculateScore(cat, dice);
            cell.textContent = potential;
        } else {
            let val = scores[player][cat];
            if (val === null) {
                // Voor sum, bonus en total tonen we 0; anders een streepje
                cell.textContent = (cat === "sum" || cat === "bonus" || cat === "total") ? "0" : "-";

            } else {
                cell.textContent = val;
            }
        }
    }
}


function updateMessage(msg) {
    message.textContent = msg;
}



/* Berekenn de som en bonus voor de bovenste scorecategorieën (Oes t/m Sixes) */

function updateUpperSection(player) {
    let cats = ["ones", "twos", "threes", "fours", "fives", "sixes"];
    let sum = 0;
    for (let i = 0; i < cats.length; i++) {
        if (scores[player][cats[i]] !== null) {
            sum += scores[player][cats[i]];
        }
    }
    scores[player].sum = sum;
    // Als de som 63 of hoger is, krijg je 35 bonuspunten
    scores[player].bonus = (sum >= 63) ? 35 : 0;

}




function updateTotal(player) {
    let total = 0;
    for (let cat in scores[player]) {
        if (cat !== "total" && scores[player][cat] !== null) {
            total += scores[player][cat];
        }
    }
    scores[player].total = total;
}


/* Bereken de score voor een gegeven categorie, op basis van de huidige dobbelsteenwaarden */
function calculateScore(cat, diceArr) {
    //tel alle dobbelsteenwaarden op
    let sumAll = 0;
    for (let i = 0; i < diceArr.length; i++) {
        sumAll += diceArr[i];
    }
}
// Bouw een teller-object: hoeveel keer komt elke waarde voor?
let counts = {};
for (let i = 0; i < diceArr.length; i++) {
    let d = diceArr[i];
    if (counts[d] === undefined) {
        counts[d] = 1;
    } else {
        counts[d]++;
    }
}

// Afhankelijk van de categorie, bereken de score
switch (cat) {
    case "ones":
        let total = 0;
        for (let i = 0; i < diceArr.length; i++) {
            if (diceArr[i] === 1) total += 1;
        }
        return total;
    case "twos":
        let total = 0;
        for (let i = 0; i < diceArr.length; i++) {
            if (diceArr[i] === 2) total += 2;
        }
        return total;
    case "threes":
        let total = 0;
        for (var i = 0; i < diceArr.length; i++) {
            if (diceArr[i] === 3) total += 3;
        }
        return total;
    case "fours":
        let total = 0;
        for (var i = 0; i < diceArr.length; i++) {
            if (diceArr[i] === 4) total += 4;
        }
        return total;
    case "fives":
        let total = 0;
        for (var i = 0; i < diceArr.length; i++) {
            if (diceArr[i] === 5) total += 5;
        }
        return total;
    case "sixes":
        let total = 0;
        for (var i = 0; i < diceArr.length; i++) {
            if (diceArr[i] === 6) total += 6;
        }
        return total;
    case "threeKind":
        if (hasOfAKind(counts, 3)) {
            return sumAll;
        } else {
            return 0;
        }
    case "fourKind":
        if (hasOfAKind(counts, 4)) {
            return sumAll;
        } else {
            return 0;
        }
    case "fullHouse":
        if (isFullHouse(counts)) {
            return 25;
        } else {
            return 0;
        }
    case "smallStraight":
        if (isSmallStraight(diceArr)) {
            return 30;
        } else {
            return 0;
        }
    case "largeStraight":
        if (isLargeStraight(diceArr)) {
            return 40;
        } else {
            return 0;
        }
    case "chance":
        return sumAll;
    case "yahtzee":
        if (isYahtzee(counts)) {
            return 50;
        } else {
            return 0;
        }
    default:
        return 0;
}
}







updateDiceUi();
updateScoreboard();







