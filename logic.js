





class TikTacToe {
  constructor() {

      this.gameIsStarted = false;
      this.pole = {
        size: {x: 0, y: 0},
        lineForWin: 0,
        arr: []
      }
      this.players = []
      this.nowTurnPlayerArrId = 0;//nowTurn: 0, // номер в массиве .players того, кто сейчас ходит
      this.turn = 0;
      this.AIDelay = 1000;
      this.gameIsOwer = false;
      this.winnerPlayerArrId = null;
      this.timeOut = undefined;
      this.HtmlElements = {
        hideElements: [],
        showElements: [],
        winnerBackground: [],
        status: [],
        turnNumber: [],
        pole: undefined,
        stopButton: undefined
      }
  }

  setHideEl(elem) {
    return this._setHtml('hideElements', elem, 'setHideEl');
  }
  setShowEl(elem) {
    return this._setHtml('showElements', elem, 'setShowEl');
  }
  setWinnerColorEl(elem) {
    return this._setHtml('winnerBackground', elem, 'setWinnerColorEl');
  }
  setStatusEl(e) {
    return this._setHtml('status', e, 'setStatusEl');
  }
  setTurnNumberEl(e) {
    return this._setHtml('turnNumber', e, 'setTurnNumberEl');
  }
  setStopGameEl(e) {
    this._setHtml('stopButton', e, 'setStopGameEl', false);
    e.onclick = ()=>{
      this.stopGame();
    }
    return this;
  }

  setPole(e) {
    return this._setHtml('pole', e, 'setPole', false);
  }
  _setHtml(where, e, err = '', toArr = true) {
    if (e !== undefined && e.style !== undefined) {
      if (toArr) {
        this.HtmlElements[where].push(e);
      }
      else this.HtmlElements[where] = e;
      return this;
    }
    else {console.log('('+err+') It is no HTML element', e);return;}
  }

  setRules(o = {}) {
    this.pole.size.x = o.x?o.x:3;
    this.pole.size.y = o.y?o.y:3;
    this.pole.lineForWin = o.line?o.line:3;

  }
  addPlayer(p) {
    if (p.symbol !== undefined && p.color !== undefined) {
      this.players.push({
        symbol: p.symbol,
        color: p.color,
        isAi: p.isAi===undefined?false:p.isAi
      });
      return this;
    }
    else {
      console.log('(addPlayer) Need more information about player. At least symbol and color'); return;
    }
  }

  start() {
    this.gameIsStarted = true;
    this._switchInterface();
    this._createPole();
    if (this._setStarterPlayer()) {
      this._aiTurn();
    }
    this._updateInterface();
  }

  _switchInterface() {
    let self = this;
    // функция скрывает или отображает элементы интерфейса
    // в зависимости от того, началась игра или нет
    if (this.gameIsStarted === true) { // если игра запущена
      hide(this.HtmlElements.hideElements);
      show(this.HtmlElements.showElements);

    } else {
      hide(this.HtmlElements.showElements);
      show(this.HtmlElements.hideElements);
      changeBG(this.HtmlElements.winnerBackground);
    }
    function hide(mass) {
      self._changeCSS_Style(mass,'none');
    }
    function show(mass) {
      self._changeCSS_Style(mass,'');
    }
    function changeBG(mass) {
      self._changeCSS_Style(mass, '', 'backgroundColor');
    }
  }

  _createPole() {
    // эта функция создаёт игровое поле для записи данных о нём и его отображения
    let poleHtml = '<table>'; // начинается всё с тега таблицы

    let axisY = 1; // ось Y
    while (axisY <= this.pole.size.y) { // пока axisY меньше или равно y (размер поля по Y сверху вниз)
      // делать:
      this.pole.arr[axisY] = [] // внутри массива создаём ещё один массив
      // это для того, что бы мы могли удобно работать с полем по типу
      // [x][y]
      poleHtml += '<tr>'; // <tr> - тег открывания строки таблицы

      let axisX = 1; // ось Х
      while (axisX <= this.pole.size.x) { // пока axisX меньше или равно х (размер поля по Х слева направо)
        this.pole.arr[axisY][axisX] = null; // тут будет храниться айди того,
        // кто походил в эту клетку, по умолчанию в значение null - тоесть ничего
        // (это не ноль, это именно псевдо число, которое в программирование
        // обозначает отсуцтвие числа)

        // продолжаем создавать табличку
        poleHtml += '<td onclick="this.parentNode.parentNode.parentNode._game.clicked('+axisX+','+axisY+')" id="cell'+axisX+'-'+axisY+'" class="cell"></td>'
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
    this.HtmlElements.pole.innerHTML = poleHtml;
    this.HtmlElements.pole.firstChild._game = this;

  }



  _setStarterPlayer() {
    this.nowTurnPlayerArrId = this._getRandomInRange(0,this.players.length-1);
    return this.players[this.nowTurnPlayerArrId].isAi;
  }

  _aiTurn() {  this.timeOut = setTimeout(()=>{
      let allPosibleMoves = [] // Массив для всех доступных ходов

      this.pole.arr.forEach((item, y) => {
        item.forEach((item, x) => {
          if (item === null) {
            allPosibleMoves.push({x: x, y: y});
          }
        });
      });
      let move = this._getRandomInRange(0, allPosibleMoves.length-1);// выбираем случайный ход

      this._makeMove(allPosibleMoves[move].x, allPosibleMoves[move].y);
    }, this._getRandomInRange(100,this.AIDelay));}

  _makeMove(x, y) {
    let player = this.players[this.nowTurnPlayerArrId];
    if (this.pole.arr[y][x] === null) {
      this.pole.arr[y][x] = player.symbol;
      this._changeHTMLSymbol(x,y,player);
      this.turn++; //просто счётчик ходов
      let winner = this._findWinner(x, y);
      if (winner === true) {
        this._winnerFound(player);
      } else if (this.turn > this.pole.size.x * this.pole.size.y) {
        this._drawFound();
      }
      else {
        this._changeTurn();
      }
      this._updateInterface();

    } else {
      alert('Сюда невозможно походить!');
    }
  }

  _changeHTMLSymbol(x,y,player) {
    let htmlCell = document.getElementById('cell'+x+'-'+y);
    htmlCell.style.backgroundColor=player.color;
    htmlCell.innerHTML = player.symbol;
  }

  _findWinner(x, y) {
      let symbol = this.pole.arr[y][x];
      let pole = this.pole.arr;
      let lineForWin = this.pole.lineForWin;
      let length, i;


    //для горизонтальной линии
      length = 1;
      i = 1;
      while (pole[y][x+i] === symbol) {
        i++;
        length++;
      }
      i = 1;
      while (pole[y][x-i] === symbol) {
        i++;
        length++;
      }

      if (length >= lineForWin) {
        return true;
      }
    //для вертикальной линии
      length = 1;
      i = 1;
      while (pole[y+i] && pole[y+i][x] === symbol) {
        i++;
        length++;
      }
      i = 1;
      while (pole[y-i] && pole[y-i][x] === symbol) {
        i++;
        length++;
      }

      if (length >= lineForWin) {
        return true;
      }




      length = 1;
      i = 1;
      while (pole[y+i] && pole[y+i][x+i] === symbol) {
        i++;
        length++;
      }
      i = 1;
      while (pole[y-i] && pole[y-i][x-i] === symbol) {
        i++;
        length++;
      }

      if (length >= lineForWin) {
        return true;
      }



      length = 1;
      i = 1;
      while (pole[y+i] && pole[y+i][x-i] === symbol) {
        i++;
        length++;
      }
      i = 1;
      while (pole[y-i] && pole[y-i][x+i] === symbol) {
        i++;
        length++;
      }

      if (length >= lineForWin) {
        return true;
      }

      return false;
    }
  _winnerFound(player) {
    this.gameIsOwer = true;
    this.winnerPlayerArrId = this.nowTurnPlayerArrId;
  }
  _drawFound() {
    this.gameIsOwer = true;
  }

  _changeTurn() {
    if (this.nowTurnPlayerArrId+1 >= this.players.length) {
      this.nowTurnPlayerArrId = 0;
    } else {
      this.nowTurnPlayerArrId++;
    }
    if (this.players[this.nowTurnPlayerArrId].isAi === true) {
      this._aiTurn();
    }
  }

  _updateInterface() {
    // функция обновляет внутри html информацию о том,
    // кто сейчас ходит и/или как закончилась игра

    // беру html элемент, в который буду выводить того, кто сейчас ходит и статус игры
    let statusDiv = this.HtmlElements.status;
    //место, куда будет выводиться номер хода
    let turnNumber = this.HtmlElements.turnNumber;
    // получаю элемент, который буду окрашивать в разные цвета (цвета того, кто победил или цвета для ничьи)
    let headerMenu = this.HtmlElements.winnerBackground;

    //вывожу номер хода
    this._insertInHtml(turnNumber, this.turn);

    if (this.gameIsOwer === true) { // если игра ЗАКОНЧЕНА
      if (this.winnerPlayerArrId === null) { //если нету победителя
        this._insertInHtml(statusDiv, 'Draw!');
        this._changeCSS_Style(headerMenu,'#c4acac','backgroundColor');
      }
      else { //иначе (если есть победитель)
        let player = this.players[this.winnerPlayerArrId]; //получаю 'карточку' игрока
        this._insertInHtml(statusDiv, 'Winner is <span>'+player.symbol+'</span>');
        this._changeCSS_Style(headerMenu, player.color,'backgroundColor');
      }
    }
    else { // иначе (если игра ПРОДОЛЖАЕТСЯ)
      let player = this.players[this.nowTurnPlayerArrId]; // получаю игрока, который сейчас должен ходить
      let s = player.isAi?'Ai Turn':'Player'; //записываем информацию о том, кто сейчас ходит
      // вставляем в стутус текст: кто ходит сейчас (игрок или бот), его символ и его цвет
      this._insertInHtml(statusDiv, s +' <span style="color: '+player.color+'">'+player.symbol+'</span>');

    }

  }





  clicked(x, y) {
    if (this.gameIsOwer === true) {
      alert('Game is Ower!');
      return;
    }

    if (this.players[this.nowTurnPlayerArrId].isAi) {
      alert('Now AI turn!');
      return;
    }
    this._makeMove(x, y);
  }


    _clearPole() {
      this.HtmlElements.pole.innerHTML = '';
    }
    stopGame() {
      clearTimeout(this.timeOut);
      this.gameIsStarted = false;
      this._switchInterface(false);
      this.HtmlElements.stopButton.onclick = '';
      this._clearPole();
    }

    _getRandomInRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    _changeCSS_Style(elem,val = 'none',prop = 'display') { //не обязательно arr, можно один Html element
      if (elem.constructor.name === 'Array') {
        elem.forEach((item) => {
          set(item, prop, val);
        });
      }
      else set(elem, prop, val);


      function set(e,p,v) {
        if (e.style) {
          e.style[p] = v;
        }
      }
    }

    _insertInHtml(elem,val) {
      if (elem.constructor.name === 'Array') {
        elem.forEach((item) => {
          item.innerHTML = val;
        });
      }
      else elem.innerHTML = val;
    }

}
