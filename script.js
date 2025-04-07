
let dice = [0, 0, 0, 0, 0];
let locked = [false, false, false, false, false];  //  dobbelstenen vergrendelen
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


let messageEl = document.getElementById("message");
let diceEls = document.querySelectorAll(".die");
let rollButton = document.getElementById("rollButton");
let scoreCells = document.querySelectorAll("[data-score]");

//  click-event  aan elke dobbelsteen zodat kunnen locken
for (let i = 0; i < diceEls.length; i++) {
    diceEls[i].addEventListener("click", function () {
        // Haal het getal uit het data-index attribuut en zet het om in een nummer
        let index = parseInt(this.getAttribute("data-index"));
        toggleLock(index);
    });
}


rollButton.addEventListener("click", rollDice);




// Voeg een click-event toe aan elke scorecel zodat de speler een score kan kiezen
for (let j = 0; j < scoreCells.length; j++) {
    scoreCells[j].addEventListener("click", function () {
        let player = parseInt(this.getAttribute("data-player"));
        let cat = this.getAttribute("data-score");
        // Laat de cel alleen werken als deze bij de huidige speler hoort, nog leeg is en er al is gegooid (rollsLeft < 3)
        if (player === currentPlayer && scores[currentPlayer][cat] === null && rollsLeft < 3) {
            let sc = calculateScore(cat, dice); // Bereken de score op basis van de dobbelsteenwaarden
            scores[currentPlayer][cat] = sc;      // Sla de score op
            this.classList.add("chosen");
            updateUpperSection(currentPlayer);
            updateTotal(currentPlayer);
            updateScoreboard();
            endTurn();
        }
    });
}


function rollDice() {
    if (rollsLeft > 0) {

        for (let i = 0; i < dice.length; i++) {
            // Als de dobbelsteen niet vergrendeld is, geef dan een willekeurig getal van 1 tot 6
            if (!locked[i]) {
                dice[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        rollsLeft--;
        updateDiceUI();
        updateMessage("Speler " + currentPlayer + " heeft gegooid. (" + rollsLeft + " worpen over)");
        updateScoreboard();
    } else {
        updateMessage("Geen worpen meer. Kies een score.");
    }
}


function toggleLock(index) {
    // Je kunt alleen locken als er al gegooid is
    if (rollsLeft < 3) {
        locked[index] = !locked[index];
        updateDiceUI();
    }
}


function endTurn() {
    // Reset de dobbelstenen, de lock-status en het aantal worpen
    dice = [0, 0, 0, 0, 0];
    locked = [false, false, false, false, false];
    rollsLeft = 3;
    // Wissel van speler: als het nu Speler 1 is, wordt het Speler 2, en andersom
    currentPlayer = (currentPlayer === 1) ? 2 : 1;
    updateDiceUI();
    updateMessage("Speler " + currentPlayer + " is aan de beurt. Klik op 'Gooien'.");
    updateScoreboard();
}

/* Werk de weergave van de dobbelstenen bij */
function updateDiceUI() {
    for (let i = 0; i < diceEls.length; i++) {
        if (dice[i] === 0) {
            diceEls[i].textContent = "?";
        } else {
            diceEls[i].textContent = dice[i];
        }
        // Voeg de CSS-class 'locked' toe als de dobbelsteen vergrendeld is
        if (locked[i]) {
            diceEls[i].classList.add("locked");
        } else {
            diceEls[i].classList.remove("locked");
        }
    }
}

/* Werk het scorebord bij */
function updateScoreboard() {
    for (let i = 0; i < scoreCells.length; i++) {
        let cell = scoreCells[i];
        let player = parseInt(cell.getAttribute("data-player"));
        let cat = cell.getAttribute("data-score");
        // Als het de kolom is van de huidige speler en de score nog niet is ingevuld, toon dan de potentiële score
        if (player === currentPlayer && scores[currentPlayer][cat] === null &&
            rollsLeft < 3 && cat !== "sum" && cat !== "bonus" && cat !== "total") {
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
    messageEl.textContent = msg;
}

/* Bereken de som en bonus voor de bovenste scorecategorieën (Ones t/m Sixes) */
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

//Bereken de score voor een gegeven categorie op basis van de huidige dobbelsteenwaarden 
function calculateScore(cat, diceArr) {
    // Tel alle dobbelsteenwaarden op
    let sumAll = 0;
    for (let i = 0; i < diceArr.length; i++) {
        sumAll += diceArr[i];
    }
    //  een teller-object hoeveel keer komt elke waarde voor
    let counts = {};
    for (let i = 0; i < diceArr.length; i++) {
        let d = diceArr[i];
        if (counts[d] === undefined) {
            counts[d] = 1;
        } else {
            counts[d]++;
        }
    }


    switch (cat) {
        case "ones":
            var total = 0;
            for (var i = 0; i < diceArr.length; i++) {
                if (diceArr[i] === 1) total += 1;
            }
            return total;
        case "twos":
            var total = 0;
            for (var i = 0; i < diceArr.length; i++) {
                if (diceArr[i] === 2) total += 2;
            }
            return total;
        case "threes":
            var total = 0;
            for (var i = 0; i < diceArr.length; i++) {
                if (diceArr[i] === 3) total += 3;
            }
            return total;
        case "fours":
            var total = 0;
            for (var i = 0; i < diceArr.length; i++) {
                if (diceArr[i] === 4) total += 4;
            }
            return total;
        case "fives":
            var total = 0;
            for (var i = 0; i < diceArr.length; i++) {
                if (diceArr[i] === 5) total += 5;
            }
            return total;
        case "sixes":
            var total = 0;
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

/* Controleer of er minimaal 'n' gelijke dobbelstenen zijn */
function hasOfAKind(counts, n) {
    for (let key in counts) {
        if (counts[key] >= n) {
            return true;
        }
    }
    return false;
}

/* Controleer op een Full House: exact een trio en een paar */
function isFullHouse(counts) {
    let hasThree = false;
    let hasTwo = false;
    for (let key in counts) {
        if (counts[key] === 3) {
            hasThree = true;
        }
        if (counts[key] === 2) {
            hasTwo = true;
        }
    }
    return hasThree && hasTwo;
}

/* Controleer op een Small Straight (4 opeenvolgende getallen) */
function isSmallStraight(arr) {
    let unique = [];
    for (let i = 0; i < arr.length; i++) {
        if (unique.indexOf(arr[i]) === -1) {
            unique.push(arr[i]);
        }
    }
    unique.sort(function (a, b) { return a - b; });
    let patterns = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6]
    ];
    for (let i = 0; i < patterns.length; i++) {
        let pattern = patterns[i];
        let match = true;
        for (let j = 0; j < pattern.length; j++) {
            if (unique.indexOf(pattern[j]) === -1) {
                match = false;
                break;
            }
        }
        if (match) {
            return true;
        }
    }
    return false;
}

/* Controleer op een Large Straight (5 opeenvolgende getallen) */
function isLargeStraight(arr) {
    var unique = [];
    for (let i = 0; i < arr.length; i++) {
        if (unique.indexOf(arr[i]) === -1) {
            unique.push(arr[i]);
        }
    }
    unique.sort(function (a, b) { return a - b; });
    let s1 = [1, 2, 3, 4, 5];
    let s2 = [2, 3, 4, 5, 6];
    return arraysEqual(unique, s1) || arraysEqual(unique, s2);
}

/* Vergelijk twee arrays op gelijke inhoud */
function arraysEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

/* Controleer of alle dobbelstenen gelijk zijn (Yahtzee) */
function isYahtzee(counts) {
    for (let key in counts) {
        if (counts[key] === 5) {
            return true;
        }
    }
    return false;
}


updateDiceUI();
updateScoreboard();
