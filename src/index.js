const order = "23456789TJQKA";

var inputs = [...document.getElementsByTagName("input")];

inputs.forEach(element => {
    element.addEventListener("keyup", validInput);
});

function getHandDetails(hand) {
    const cards = hand.split(" ");
    const faces = cards.map((a) => String.fromCharCode([77 - order.indexOf(a[0])])).sort();
    const suits = cards.map((a) => a[1]).sort();
    const counts = faces.reduce(count, {});
    const duplicates = Object.values(counts).reduce(count, {});
    const flush = suits[0] === suits[4];
    const first = faces[0].charCodeAt(0);
    //Also handle low straight
    const lowStraight = faces.join("") === "AJKLM";
    faces[0] = lowStraight ? "N" : faces[0];
    const straight = lowStraight || faces.every((f, index) => f.charCodeAt(0) - first === index);
    let rank =
        (flush && straight && 1) ||
        (duplicates[4] && 2) ||
        (duplicates[3] && duplicates[2] && 3) ||
        (flush && 4) ||
        (straight && 5) ||
        (duplicates[3] && 6) ||
        (duplicates[2] > 1 && 7) ||
        (duplicates[2] && 8) ||
        9;

    return { rank, value: faces.sort(byCountFirst).join("") }

    function byCountFirst(a, b) {
        //Counts are in reverse order - bigger is better
        const countDiff = counts[b] - counts[a];
        if (countDiff) return countDiff; // If counts don't match return
        return b > a ? -1 : b === a ? 0 : 1;
    }
    function count(c, a) {
        c[a] = (c[a] || 0) + 1;
        return c;
    }
}

var scorePlayer1 = 0;
var scorePlayer2 = 0;

function compareHands(h1, h2) {
    let d1 = getHandDetails(h1)
    let d2 = getHandDetails(h2)
    if (d1.rank === d2.rank) {
        if (d1.value < d2.value) {
            scorePlayer1 += 1;
            return "player 1"
        } else if (d1.value > d2.value) {
            scorePlayer2 += 1;
            return "player 2"
        } else {
            return "DRAW"
        }
    }
    
    if(d1.rank < d2.rank) {
        scorePlayer1 += 1;
        return "player 1"
    }
    else {
    scorePlayer2 += 1;
    return "player 2"
    }

}

function countHands() {
    var pokerArray = [];

    var round1 = document.getElementById("round1").value;
    var round2 = document.getElementById("round2").value;
    var round3 = document.getElementById("round3").value;
    var round4 = document.getElementById("round4").value;
    var round5 = document.getElementById("round5").value;

    pokerArray.push(round1);
    pokerArray.push(round2);
    pokerArray.push(round3);
    pokerArray.push(round4);
    pokerArray.push(round5);  
    
    for(var j=0; j<pokerArray.length; j++) {
        roundHands=pokerArray[j];
        var p1 = roundHands.substring(0,14);  //Player 1 hands
        var p2 = roundHands.substring(15,29); //Player 2 hands
        compareHands(p1,p2);
    }


document.getElementById("player1").innerHTML = `Player 1: <span>${scorePlayer1}</span>`;
document.getElementById("player2").innerHTML = `Player 2: <span>${scorePlayer2}</span>`;
}

function validInput(e){
    console.log(e.currentTarget.value);
    if(e.currentTarget.value.split(" ").length==10) {
        document.getElementById("countHands").removeAttribute("disabled");
        e.currentTarget.nextElementSibling.innerText = "";
        return true;
    }
    else {
        document.getElementById("countHands").setAttribute("disabled","disabled");
        e.currentTarget.nextElementSibling.innerText = "Invalid input";
    }
}

