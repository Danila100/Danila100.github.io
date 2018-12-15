var CROSS = 'X';
var ZERO = 'O';
var EMPTY = ' ';

var dimension = 0;

var gameState = [];

var finishflag = false;

var move;

var player = true;
startGame();

function startGame () {
    getSize();
    renderGrid(dimension);
    resetGameState();
    showMessage('');
    move = CROSS;
}

/* обработчик нажатия на клетку */
function cellClickHandler (row, col) {
    // Пиши код тут
    let result;
    if ( !finishflag )
    {
        if ( gameState[row][col] !== EMPTY )
            return;
        renderSymbolInCell(move, row, col);
        gameState [row][col] = move;
        result = checkResult(row, col);
        if ( result !== undefined){
            showMessage('Победил ' + move);
            console.log('win!');
            gameResult(result);
            finishflag = true;
        }
        else
            checkDraw();
        if ( move === CROSS ){
            move = ZERO;
        }
        else {
            move = CROSS;
        }
        console.log(`Clicked on cell: ${row}, ${col}`);
        if (player) {
            randomPlayer();
        }
        player = true;
    }


    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
}

/* обработчик нажатия на кнопку "Сначала" */
function resetClickHandler () {
    startGame();
    console.log('reset!');
}

/* Служебные фукнции для взаимодействия с DOM. Данные функции нельзя редактировать! */
/* Показать сообщение */
function showMessage(text) {
  var msg = document.querySelector('.message');
  msg.innerText = text
}

/* Нарисовать игровое поле заданного размера */
function renderGrid (dimension) {
  var container = getContainer();
  container.innerHTML = '';

  for (let i = 0; i < dimension; i++) {
    var row = document.createElement('tr');
    for (let j = 0; j < dimension; j++) {
      var cell = document.createElement('td');
      cell.textContent = EMPTY;
      cell.addEventListener('click', () => cellClickHandler(i, j));
      row.appendChild(cell);
    }
    container.appendChild(row);
  }
}

/* Нарисовать символ symbol в ячейку(row, col) с цветом color */
function renderSymbolInCell (symbol, row, col, color = '#333') {
  var targetCell = findCell(row, col);

  targetCell.textContent = symbol;
  targetCell.style.color = color;
}

function findCell (row, col) {
  var container = getContainer();
  var targetRow = container.querySelectorAll('tr')[row];
  return targetRow.querySelectorAll('td')[col];
}

function getContainer() {
  return document.getElementById('fieldWrapper');
}

/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}

function checkDraw() {
    if ( isGridFull()){
        showMessage('Победила дружба!');
        console.log('draw!');
        finishflag = true;
    }
}
function checkResult(row, col) {
    let k = 0;
    let winLine = [];

    // row
    for (let i = 0; i < dimension; ++i) {
        if (gameState[row][i] === move)
            ++k;
        winLine[i] = ({ row: row, col: i });
    }
    if ( k === dimension) {
        return winLine;
    }
    k = 0;

    // col
    for (let j = 0; j < dimension; ++j) {
        if (gameState[j][col] === move)
            ++k;
        winLine[j] = ({ row: j, col: col });
    }
    if ( k === dimension) {
        return winLine;
    }
    k = 0;

    // diagonals
    if ( row === col ) {

        for (let i = 0; i < dimension; ++i) {
            if (gameState[i][i] === move)
                ++k;
            winLine[i] = ({row: i, col: i});
        }
        if (k === dimension) {
            return winLine;
        }
        k = 0;
    }
    if ( row + col === dimension - 1 ){
        for (let i = 0; i < dimension; ++i) {
            if (gameState[i][dimension - i - 1] === move)
                ++k;
            winLine[i] = ({row: i, col: dimension - i - 1});
        }
        if (k === dimension) {
            return winLine;
        }

    }
    return undefined;
}

function isGridFull() {
    for (let i = 0; i < dimension; ++i) {
        if ( gameState[i].indexOf(EMPTY) !== -1 )
            return false;
    }
    return true;
}

function gameResult(winLine) {
        for ( let i = 0; i < dimension; ++i )
        {
            renderSymbolInCell(move,winLine[i].row, winLine[i].col, '#ff0000');
        }
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min )) + min;
}

function getEmptyIndex() {
    let k = 0;
    let emptyIndex = [];
    for ( var i = 0; i < dimension; ++i) {
        for ( let j = 0; j < dimension; ++j) {
            if ( gameState[i][j] === EMPTY) {
                emptyIndex.push({row: i, col: j});
                ++k;
            }
        }
    }
    return emptyIndex;
}

function randomPlayer() {
    if ( !finishflag ) {
        let emptyIndex = getEmptyIndex();
        let randomIndex = Math.floor(Math.random() * emptyIndex.length);
        let row = emptyIndex[randomIndex].row;
        let col = emptyIndex[randomIndex].col;
        player = false;
        cellClickHandler(row, col);
    }
}

function getSize() {
    dimension = Number(prompt("Введите размер",''));
    if ( dimension < 3 ){
        alert('Минимальное поле 3х3! ');
        dimension = 3;
    }
}

function resetGameState() {
    for ( let i = 0; i < dimension; ++i) {
        gameState[i] = [];
        for ( let j = 0; j < dimension; ++j) {
            gameState[i][j] = EMPTY;
        }
    }
    finishflag = false;
}
