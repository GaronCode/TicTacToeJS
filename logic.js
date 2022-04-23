let game = {};


function startGame() {
  //в объект гейм записываем данные
  game = {
    isStarted: true,
    x: document.getElementById('inputX').value, //размер поля по оси X - получаем значения из поля ввода
    y: document.getElementById('inputY').value, //размер поля по оси Y - получаем значения из поля ввода
    aiMode: document.getElementById('inputAi').checked, //размер поля по оси Y - получаем значения из поля ввода
    lineForWin: document.getElementById('inputWin').value, //длина линии для выйгрыша - получаем значения из поля ввода
    players: [ //массив, где будут храниться данные игроков
      {
        symbol: 'X', //символ игрока
        color: '#ea4e4e',  //цвет игрока
        isAi: false
      },
      {
        symbol: 'O', //символ игрока
        color: '#737ad9',  //цвет игрока
        isAi: false
      }
    ],
    nowTurn: 0, // номер в массиве .players того, кто сейчас ходит
    turn: 1, //номер хода
    pole: [], //массив игрового поля.
    gameIsOwer: false, // флаг того, закончилась ли игра
    winner: null // номер из массива .players того, кто победил

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
  let inGame = document.getElementById('inGameMenu'); //беру html элемент с айди inGameMenu
  let mainMenu = document.getElementById('mainMenu'); //беру html элемент с айди mainMenu
  if (game.isStarted === true) { // если игра началась
    inGame.style.display = 'block'; // отображаю div с айди inGameMenu
    mainMenu.style.display = 'none';// прячу div c айди mainMenu
  } else { // иначе (если игра не началась)
    mainMenu.style.display = 'block';// отображаю div с айди mainMenu
    inGame.style.display = 'none';// прячу div c айди inGameMenu
  }
}


function updateInterface() {
  // функция обновляет внутри html информацию о том,
  // кто сейчас ходит или как закончилась игра
  let html = document.getElementById('nowTurn'); // беру html элемент, который буду менять

  if (game.gameIsOwer === true) { // если игра закончена
    if (game.winner === null) { //если нету победителя
      html.innerHTML = 'Ничья'; // вставляю в html текст
      html.style.backgroundColor = '#c4acac'; // меняю цвет этого DIV'а
    }
    else { //иначе (если есть победитель)
      let player = game.players[game.winner]; //получаю 'карточку' игрока
      html.innerHTML = 'Победил '+player.symbol; // вставляю в html текст кто победил
      html.style.backgroundColor = player.color; // меняю цвет этого DIV'а на цвет победителя
    }
  }
  else { // иначе (если игра НЕ закончена)
    let player = game.players[game.nowTurn]; // получаю игрока, который сейчас должен ходить
    let s = player.isAi?'Ход ИИ':'Ход игрока';
    html.innerHTML = s +' <span style="font-size: xx-large; color: '+player.color+'">'+player.symbol+'</span>';
    // пишу кто ходит сейчас и вставляю его букву и меняю её цвет
    html.style.backgroundColor = '#cbd5fd94'; // на всякий случай меняю цвет фона на стандартный
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
      poleHtml += '<td onclick="clicked('+axisX+','+axisY+')" id="cell'+axisX+'-'+axisY+'" class="cell">'+axisX+','+axisY+'</td>'
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
    alert('Игра закончена!');
    return;
  }

  if (game.players[game.nowTurn].isAi) {
    alert('Сейчас ход ИИ!');
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
  alert('Игрок с символом '+player.symbol+' побеждает! Поздравляем!');
}
function drawFound() {
  game.gameIsOwer = true;
  alert('Ничья');
}

function clearPole() {
  document.getElementById('pole').innerHTML = 'Начните игру';
}



function stopGame() {
  game.isStarted = false;
  switchInterface(false);
  clearPole();
}

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
