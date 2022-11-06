// Set Global variables
let fieldSize = 0;
let percentMines = 0;
let mineField = [];

const startModal = document.getElementById('startmodal');
const btnStartGame = document.getElementById('BtnStartGame');
const starBkg = document.getElementById('starbkg');
const gameBoard = document.getElementById('gameboard');
const gameOverModal = document.getElementById('gameovermodal');
const btnRestartGame = document.getElementById('BtnRestartGame');
const sizeSlider = document.getElementById('SizeSlider');
const diffSlider = document.getElementById('DiffSlider');


//const mode = easy;
//also set percent in randomSquares()

function generateMineField() {
// Generate 2D array
// Fill array with 0
    //debugger;
    //let field = new Array(fieldSize);
    let field = [];
    for (i = 0; i < fieldSize; i++) {
        field[i] = [];
    }
    for (y = 0; y < fieldSize; y++) {
        for (x = 0; x < fieldSize; x++) {
            field[y][x] = 0;
        }
    }
// Fill array with bombs
    amount = Math.round(percentMines * Math.pow(fieldSize, 2));
    for (i = 0; i < amount; i++) {
        field[random(fieldSize)][random(fieldSize)] = "M";
    }
    function random(max) {
        let rand = Math.floor(Math.random() * max);
        return rand;
    }
// Fill array with numbers
    field.forEach((el, y) => {
        el.forEach((el2, x) => {
            if (el2 == "M") {/*console.log(y, x, el2)*/; return;}
            else {
                array = selectAllSurrounding(y, x);
                let counter = 0;
                for (i = 0; i < array.length; i++) {
                    if (field[array[i][0]][array[i][1]] == "M") counter++;
                }
                field[y][x] = counter;
            }
        });
    });
    return field;
}


function renderMineField(array) {
    // create grid template based on n
        for (y = 0; y < array.length; y++) {
            for (x = 0; x < array.length; x++) {
            gameBoard.insertAdjacentHTML('beforeend', 
            `<div class="square" id="${y}-${x}" y="${y}" x="${x}" val="${array[y][x]}"></div>`
            );
            }
        }
    }


function checkValidity(i, j) {
    if (i < 0) return false;
    else if (j < 0) return false;
    else if (i >= fieldSize) return false;
    else if (j >= fieldSize) return false; 
    else return true
}

function selectAllSurrounding(y, x) {
    let array = [];

    let asdf = [[y, x+1], [y+1, x+1], [y+1, x], [y+1, x-1], [y, x-1], [y-1, x-1], [y-1, x], [y-1, x+1]];

    for (i = 0; i < 8; i++) {
        if (checkValidity(asdf[i][0], asdf[i][1])) {array.push(asdf[i])}
        else continue;
    }
    return array;
}

function openSquares(y, x) {
    console.log('hej', y, x)
    if (!checkValidity(y, x)) {return}

    if (mineField[y][x] > 0) {
        // mineField[y][x] = "X";
        // document.getElementById(`${y}-${x}`).classList.add('opensquare'); //HÄR?
        showSquare(y, x);
    } else if (mineField[y][x] == 0) {
        // mineField[y][x] = "X";
        // document.getElementById(`${y}-${x}`).classList.add('opensquare'); //HÄR?
        showSquare(y, x);


        openSquares(y, x+1)
        openSquares(y+1, x+1)

        openSquares(y+1, x)
        openSquares(y+1, x-1)

        openSquares(y, x-1)
        openSquares(y-1, x-1)

        openSquares(y-1, x)
        openSquares(y-1, x+1)
    } else {return}
}


const parseCoord = function (e) {
    const y = parseInt(e.target.getAttribute('y'));
    const x = parseInt(e.target.getAttribute('x'));
    return [y, x];
}

const stateOfSquare = function (element) {
    const arr = element.getAttribute('class').split(' ');
    return arr;
}

const showSquare = function (y, x) {
    const element = document.getElementById(`${y}-${x}`);
    element.classList.add('opensquare');
    mineField[y][x] = "X";
    element.innerText = element.getAttribute('val');
}

function checkForMine(event) {
    //debugger;
    if (event.target.id == 'MineField') {return};
    const y = parseCoord(event)[0];
    const x = parseCoord(event)[1];
    const value = mineField[y][x];
    // const id = event.target.getAttribute('id'); 
    // const y = parseInt(id[0]), x = parseInt(id[1]); //HÄR
    const element = document.getElementById(`${y}-${x}`)
    const state = stateOfSquare(event.target);

    if (state.includes('flagged')) {
        element.classList.remove('flagged');
        element.innerHTML = '';
    } else if (value == "M") {
        showSquare(y, x);
        gameOver();
    } else if (value == 0) {
        openSquares(y, x);
    } else if (typeof(value) == "number") {
        // element.classList.add('opensquare');
        // mineField[y][x] = "X";
        showSquare(y, x);
    }
}

function markSquare(event) {
    event.preventDefault();
    const y = parseCoord(event)[0];
    const x = parseCoord(event)[1];
    const id = event.target.getAttribute('id'); 
    const state = stateOfSquare(event.target);
    // const y = parseInt(id[0]), x = parseInt(id[1]); //HÄR
    //const element = document.getElementById(`${y}-${x}`);

    if (id == 'MineField' || state.includes('opensquare')) {
        return;
    } else {
        event.target.classList.add('flagged');
        event.target.innerHTML = '<i class="fa-sharp fa-solid fa-diamond"></i>';

    }
}

function gameOver(){
    console.log('game over');

    document.body.insertAdjacentHTML('beforeend', `<div id="asteroid"><img src="img/asteroid.png" id="asteroidimg" alt="asteroid"></div>`)
    document.body.insertAdjacentHTML('beforeend', `<div id="crasheffect"></div>`)
    gameOverModal.classList.remove('hidden');

    btnRestartGame.addEventListener('click', function () {
        gameBoard.innerHTML = "";
        gameOverModal.classList.add('hidden');
        startModal.classList.remove('hidden');
    });
}

// Startscreen
const sliderValue = function (el) {
    if (el.id == 'SizeSlider') {
        document.getElementById('ShowSizeSetting').textContent = el.value;
    } else if (el.id == 'DiffSlider') {
        document.getElementById('ShowDiffSetting').textContent = el.value;
    }
}
btnStartGame.addEventListener('click', function () {
    startModal.classList.add('hidden');
    // Game settings
    fieldSize = document.getElementById('SizeSlider').value;
    percentMines = document.getElementById('DiffSlider').value / 100;
    document.querySelector(':root').style.setProperty('--fieldSize', fieldSize);

    // Init Game
    mineField = generateMineField();
    renderMineField(mineField);
    gameBoard.addEventListener('contextmenu', markSquare);
    gameBoard.addEventListener('click', checkForMine);
});

// Init startscreen
// sliderValue(sizeSlider); diffValue(diffSlider);
sliderValue(document.getElementById('SizeSlider'));
sliderValue(document.getElementById('DiffSlider'));


////////////////////////////////
// STAR BACKGROUND /////////////
////////////////////////////////
// Needs cleaning up
const renderStars = function () {
    starBkg.innerHTML = "";
    for (i = 0; i < 100; i++) {
        let ymax = window.innerHeight;
        let xmax = window.innerWidth;
        let min = 0;
    
        let y = Math.floor(Math.random() * (ymax - min) + min);
        let x = Math.floor(Math.random() * (xmax - min) + min);
    
        starBkg.insertAdjacentHTML('beforeend', 
        `<div class="star" style="top: ${y}px; left: ${x}px;"></div>`)
    }
    
    for (i = 0; i < 100; i++) {
        let ymax = window.innerHeight;
        let xmax = window.innerWidth;
        let min = 0;
    
        let y = Math.floor(Math.random() * (ymax - min) + min);
        let x = Math.floor(Math.random() * (xmax - min) + min);
    
    
        starBkg.insertAdjacentHTML('beforeend', 
        `<div class="starsmall" style="top: ${y}px; left: ${x}px;"></div>`)
    }
}
renderStars();
window.addEventListener('resize', renderStars);

