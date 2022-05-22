let game = {};


function startGame() {
  //в объект гейм записываем данные


  game = {
    isStarted: true,
    x: document.getElementById('inputX').value, //размер поля по оси X - получаем значения из поля ввода
    y: document.getElementById('inputY').value, //размер поля по оси Y - получаем значения из поля ввода
    aiMode: document.getElementById('inputAi').checked, //размер поля по оси Y - получаем значения из поля ввода
    lineForWin: document.getElementById('inputWin').value, //длина линии для выйгрыша - получаем значения из поля ввода
    players: [ //массив, где будут храниться данные всех игроков
      {
        symbol: 'X', //символ игрока
        color: '#ea4e4e',  //цвет игрока
        isAi: false  //играет бот?
      },
      {
        symbol: 'O', //символ игрока
        color: '#737ad9',  //цвет игрока
        isAi: false //играет бот?
      }
    ],
    nowTurn: 0, // номер в массиве .players того, кто сейчас ходит
    turn: 1, //номер хода
    pole: [], //массив игрового поля.
    gameIsOwer: false, // флаг того, закончилась ли игра (игра закончена?)
    winner: null // номер из массива .players того, кто победил, если нет победителя - null

  }



    switchInterface(); //переключает кнопки настроек или внутриигровые элементы
    createPole(); //создаёт поле по данным из объекта game

    setStarterPlayer();

    updateInterface(); //обновляет нынешнее состояние игры в интерфейсе
}

function setStarterPlayer() {

  if (game.aiMode) {
    let i = getRandomInRange(0,game.players.length-1);
    game.players[i].isAi = true;

    if (i === 0) {
      aiTurn();
    }
  }
}

function switchInterface() {
  // функция скрывает или отображает элементы интерфейса
  // в зависимости от того, началась игра или нет
  //------------------------------------------------------------------------------//
  //беру html элементы для взаимодействия
  //меню, которое должно отображаться когда идёт игра
  let inGame = document.getElementById('inGameMenu');
  //Заголовок игры, отображается, когда в меню
  let headerName = document.getElementById('header-name');
  //всё меню настроек игры
  let mainMenu = document.getElementById('mainMenu');
  //игровое полем
  let pole = document.getElementById('pole');

  if (game.isStarted === true) { // если игра запущена
    inGame.style.display = ''; // отображаю внутриигровой интерфейс
    pole.style.display = '';
    mainMenu.style.display = 'none';// прячу меню настроек
    headerName.style.display = 'none'; //прячу заголовок
  } else { // иначе (если игра не запущена)
    pole.style.display = 'none';
    mainMenu.style.display = '';// отображаю меню настроек
    inGame.style.display = 'none';// прячу внутриигровой интерфейс
    headerName.style.display = '';// отображаю название игры

    //сбрасываю цвет внутриигрового интерфейса
    document.getElementById('header-menu').style.backgroundColor = '';
  }
}


function updateInterface() {
  // функция обновляет внутри html информацию о том,
  // кто сейчас ходит и/или как закончилась игра

  // беру html элемент, в который буду выводить того, кто сейчас ходит и статус игры
  let statusDiv = document.getElementById('nowTurn');
  //место, куда будет выводиться номер хода
  let turnNumber = document.getElementById('turn-number');
  // получаю элемент, который буду окрашивать в разные цвета (цвета того, кто победил или цвета для ничьи)
  let headerMenu = document.getElementById('header-menu');

  //вывожу номер хода
  turnNumber.innerHTML = game.turn;

  if (game.gameIsOwer === true) { // если игра ЗАКОНЧЕНА
    if (game.winner === null) { //если нету победителя
      statusDiv.innerHTML = 'Draw!'; // вставляю в статус текст ничьи
      headerMenu.style.backgroundColor = '#c4acac'; // меняю цвет шапки
    }
    else { //иначе (если есть победитель)
      let player = game.players[game.winner]; //получаю 'карточку' игрока
      statusDiv.innerHTML = 'Winner is <span>'+player.symbol+'</span>'; // вставляю в статус текст кто победил
      headerMenu.style.backgroundColor = player.color; // меняю цвет шапки на цвет победителя
    }
  }
  else { // иначе (если игра ПРОДОЛЖАЕТСЯ)
    let player = game.players[game.nowTurn]; // получаю игрока, который сейчас должен ходить
    let s = player.isAi?'Ai Turn':'Player'; //записываем информацию о том, кто сейчас ходит
    // вставляем в стутус текст: кто ходит сейчас (игрок или бот), его символ и его цвет
    statusDiv.innerHTML = s +' <span style="color: '+player.color+'">'+player.symbol+'</span>';

  }

}


function createPole() {
  // эта функция создаёт игровое поле для записи данных о нём и его отображения
  let poleHtml = '<table>'; // начинается всё с тега таблицы

  let axisY = 1; // ось Y
  while (axisY <= game.y) { // пока axisY меньше или равно game.y (размер поля по Y сверху вниз)
    // делать:
    game.pole[axisY] = [] // внутри массива создаём ещё один массив
    // это для того, что бы мы могли удобно работать с полем по типу
    // game.pole[x][y]
    poleHtml += '<tr>'; // <tr> - тег открывания строки таблицы

    let axisX = 1; // ось Х
    while (axisX <= game.x) { // пока axisX меньше или равно game.х (размер поля по Х слева направо)
      game.pole[axisY][axisX] = null; // тут будет храниться айди того,
      // кто походил в эту клетку, по умолчанию в значение null - тоесть ничего
      // (это не ноль, это именно псевдо число, которое в программирование
      // обозначает отсуцтвие числа)

      // продолжаем создавать табличку
      poleHtml += '<td onclick="clicked('+axisX+','+axisY+')" id="cell'+axisX+'-'+axisY+'" class="cell"></td>'
      // тег td создаёт одну ячейку,
      // параметр onclick - действие, которое будет совершено при клике
      // тут при клике будет выполняться функция clicked(x,y)
      // допустим сейчас axisX = 1, axisY = 3, тогда при клике
      // запустится функция clicked(1,3)
      // параметр id нужен для вставки символов и покраски ячейки.
      // допустим сейчас axisX = 1, axisY = 3, тогда айди у этой
      // ячейки будет id="cell1-3"
      // тоесть в итоге получается такая фигня:
      // <td onclick="clicked(1,3)" id="cell1-3" class="cell">1,3</td>
      axisX++; // переходим к следующей ячейки
    }
    axisY++; // перебрали все ячейки, теперь переходим к следующей строке
    poleHtml += '</tr>'; // закрываем строку
  }
  // тут мы окажемся когда все ячейки и все строки созданы
  poleHtml += '</table>'; // и мы просто закрываем тег таблицы
  // а потом вставляем то, что у нас вышло в HTML
  document.getElementById('pole').innerHTML = poleHtml;

}


function aiTurn() {
  setTimeout(()=>{
    let allPosibleMoves = [] // Массив для всех доступных ходов

    game.pole.forEach((item, y) => {
      item.forEach((item, x) => {
        if (item === null) {
          allPosibleMoves.push({x: x, y: y});
        }
      });
    });



    let move = getRandomInRange(0, allPosibleMoves.length-1);// выбираем случайный ход

    makeMove(allPosibleMoves[move].x, allPosibleMoves[move].y);
  }, 1000);

}


function clicked(x, y) {
  if (game.gameIsOwer === true) {
    alert('Game is Ower!');
    return;
  }

  if (game.players[game.nowTurn].isAi) {
    alert('Now AI turn!');
  }
  else makeMove(x, y);
}


function makeMove(x, y) {
  let player = game.players[game.nowTurn];
  if (game.pole[y][x] === null) {
    game.pole[y][x] = player.symbol;
    changeHTMLSymbol(x,y,player);
    game.turn++;
    let winner = findWinner(x, y);
    if (winner === true) {
      winnerFound(player);
    } else if (game.turn > game.x * game.y) {
      drawFound();
    }
    else {
      changeTurn();
      if (game.players[game.nowTurn].isAi) {
        aiTurn();
      }
    }
    updateInterface();

  } else {
    alert('Сюда невозможно походить!');
  }
}



function findWinner(x, y) {
  let symbol = game.pole[y][x];

  let length, i;


//для горизонтальной линии
  length = 1;
  i = 1;
  while (game.pole[y][x+i] === symbol) {
    i++;
    length++;
  }
  i = 1;
  while (game.pole[y][x-i] === symbol) {
    i++;
    length++;
  }

  if (length >= game.lineForWin) {
    return true;
  }
//для вертикальной линии
  length = 1;
  i = 1;
  while (game.pole[y+i] && game.pole[y+i][x] === symbol) {
    i++;
    length++;
  }
  i = 1;
  while (game.pole[y-i] && game.pole[y-i][x] === symbol) {
    i++;
    length++;
  }

  if (length >= game.lineForWin) {
    return true;
  }




  length = 1;
  i = 1;
  while (game.pole[y+i] && game.pole[y+i][x+i] === symbol) {
    i++;
    length++;
  }
  i = 1;
  while (game.pole[y-i] && game.pole[y-i][x-i] === symbol) {
    i++;
    length++;
  }

  if (length >= game.lineForWin) {
    return true;
  }



  length = 1;
  i = 1;
  while (game.pole[y+i] && game.pole[y+i][x-i] === symbol) {
    i++;
    length++;
  }
  i = 1;
  while (game.pole[y-i] && game.pole[y-i][x+i] === symbol) {
    i++;
    length++;
  }

  if (length >= game.lineForWin) {
    return true;
  }

  return false;
}

function changeHTMLSymbol(x,y) {
  let htmlCell = document.getElementById('cell'+x+'-'+y);
  htmlCell.style.backgroundColor=game.players[game.nowTurn].color;
  htmlCell.innerHTML = game.players[game.nowTurn].symbol;
}

function changeTurn() {
  if (game.nowTurn+1 >= game.players.length) {
    game.nowTurn = 0;
  } else {
    game.nowTurn++;
  }
}

function winnerFound(player) {
  game.gameIsOwer = true;
  game.winner = game.nowTurn;
}
function drawFound() {
  game.gameIsOwer = true;
}

function clearPole() {
  document.getElementById('pole').innerHTML = '';
}



function stopGame() {
  game.isStarted = false;
  switchInterface(false);
  clearPole();
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}




function setHtmlPole(x,y,l) {
  document.getElementById('inputX').value = x;
  document.getElementById('inputY').value = y;
  document.getElementById('inputWin').value = l;
}
