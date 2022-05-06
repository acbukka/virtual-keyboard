/* eslint-disable import/extensions */
import keysObj from './keys.js';
// Зададим переменные для капса и языка
let isCapsed = false;
let isRu = false;

// для начала создадим функцию, которая будет "рисовать "
function printWindowKeys(width, height, text) {
  let widthIn = width;
  let heightIn = height;
  let textIn = text;
  if (widthIn < 4) {
    widthIn = 4;
  }
  if (heightIn < 4) {
    heightIn = 4;
  }
  const arr = [];
  for (let i = 0; i < heightIn; i += 1) {
    if (i === 0) {
      arr.push('_'.repeat(widthIn));
    } else if (i === heightIn - 2) {
      let str = '||';
      str += '_'.repeat(widthIn - 4);
      str += '||';
      arr.push(str);
    } else if (i === heightIn - 1) {
      let str = '|/';
      str += '_'.repeat(widthIn - 4);
      str += '\\|';
      arr.push(str);
    } else if (i === 1) {
      let str = '||';
      if (textIn.length > widthIn - 4) {
        textIn = textIn.substring(0, widthIn - 4);
      }
      str += textIn;
      str += ' '.repeat(widthIn - 4 - textIn.length);
      str += '||';
      arr.push(str);
    } else {
      let str = '||';
      str += ' '.repeat(widthIn - 4);
      str += '||';
      arr.push(str);
    }
  }
  let symbol = '';
  for (let i = 0; i < arr.length; i += 1) {
    symbol += arr[i];
    symbol += ' \n';
  }
  return symbol;
}
//
//
function renderKeyboard(Shift, Ru) {
  Object.keys(keysObj).forEach((key) => {
    const myKey = document.getElementById(key);
    const curKey = keysObj[key];
    if (Shift === false && Ru === true) {
      myKey.innerHTML = printWindowKeys(curKey.width, curKey.height, curKey.textRu);
    }
    if (Shift === true && Ru === true) {
      myKey.innerHTML = printWindowKeys(curKey.width, curKey.height, curKey.textShiftRu);
    }
    if (Shift === false && Ru === false) {
      myKey.innerHTML = printWindowKeys(curKey.width, curKey.height, curKey.textEn);
    }
    if (Shift === true && Ru === false) {
      myKey.innerHTML = printWindowKeys(curKey.width, curKey.height, curKey.textShiftEn);
    }
  });
}

/* зададим local storage и в нем же будем вызывть рендер клавиш, эту функцию будем вызывать при
загрузке страницы */
function getLocalStorage() {
  if (localStorage.getItem('isRu') === 'true') {
    isRu = true;
  } else if (localStorage.getItem('isRu') === 'false') {
    isRu = false;
  }
  if (localStorage.getItem('isCapsed') === 'true') {
    isCapsed = true;
  } else if (localStorage.getItem('isCapsed') === 'false') {
    isCapsed = false;
  }
  renderKeyboard(isCapsed, isRu);
}

function eventPressed(event) {
  const textarea = document.querySelector('.textarea');
  // отключим поведение таба по умолчанию
  if (event.key === 'Tab') event.preventDefault();
  textarea.setAttribute('readonly', 'readonly');
  const key = document.getElementById(event.code);
  key.classList.add('pressed');
  // TODO Сделать так чтобы клавиши могли быть "зажаты" при удерживании мышкой
  // if (event.code && one.classList.contains('pressed')) {

  // }
  // добавим условия для шифта
  if (event.code === 'ShiftRight' || event.code === 'ShiftLeft') {
    renderKeyboard(!isCapsed, isRu);
  }
  // добавим условия для капса
  if (event.code === 'CapsLock') {
    isCapsed = !isCapsed;
    localStorage.setItem('isCapsed', isCapsed);
    renderKeyboard(isCapsed, isRu);
  }
  // добавим условия для шифта и альта + правого шифта и альта + кнопки языка для смены языка
  if (event.shiftKey && event.altKey) {
    isRu = !isRu;
    localStorage.setItem('isRu', isRu);
    renderKeyboard(isCapsed, isRu);
  } else if (event.code === 'AltRight' && event.shiftKey) {
    isRu = !isRu;
    localStorage.setItem('isRu', isRu);
    renderKeyboard(isCapsed, isRu);
  } else if (event.code === 'Lang') {
    isRu = !isRu;
    localStorage.setItem('isRu', isRu);
    renderKeyboard(isCapsed, isRu);
  }
  //
  let cursor = textarea.selectionStart;
  textarea.focus();
  if (event.code === 'Backspace') {
    let areaBeforeMyCursor = textarea.value.substring(0, cursor);
    const areaAfterMyCursor = textarea.value.substring(textarea.selectionEnd);
    if (cursor === textarea.selectionEnd) {
      areaBeforeMyCursor = areaBeforeMyCursor.slice(0, -1);
      cursor -= (cursor > 0) ? 2 : 1;
    } else cursor -= 1;
    textarea.value = areaBeforeMyCursor + areaAfterMyCursor;
    textarea.setSelectionRange(cursor + 1, cursor + 1);
  } else if (event.code === 'Tab') {
    textarea.value += '\t';
  } else if (event.code === 'Enter') {
    textarea.value += '\n';
  } else if (event.code === 'Space') {
    textarea.value += ' ';
  } else if (event.code === 'ArrowUp') {
    const areaBeforeMyCursor = textarea.value.substring(0, cursor).split('\n');
    if (areaBeforeMyCursor.length === 1
      || areaBeforeMyCursor[areaBeforeMyCursor.length - 1].length >= 57) {
      cursor -= 57;
    } else if (areaBeforeMyCursor[areaBeforeMyCursor.length - 1].length
      <= areaBeforeMyCursor[areaBeforeMyCursor.length - 2].length % 57) {
      cursor -= (areaBeforeMyCursor[areaBeforeMyCursor.length - 2].length % 57) + 1;
    } else {
      cursor -= areaBeforeMyCursor[areaBeforeMyCursor.length - 1].length + 1;
    }
    if (cursor < 0) cursor = 0;
    textarea.setSelectionRange(cursor, cursor);
  } else if (event.code === 'ArrowLeft') {
    if (cursor > 0) {
      textarea.setSelectionRange(cursor - 1, cursor - 1);
    }
  } else if (event.code === 'ArrowDown') {
    cursor = textarea.selectionEnd;
    const areaBeforeMyCursor = textarea.value.substring(0, cursor).split('\n');
    const areaAfterMyCursor = textarea.value.substring(textarea.selectionEnd).split('\n');
    if (areaAfterMyCursor.length === 1 || areaAfterMyCursor[0].length >= 57) {
      cursor += 57;
    } else if ((areaBeforeMyCursor[areaBeforeMyCursor.length - 1].length % 57)
      > areaAfterMyCursor[1].length) {
      cursor += areaAfterMyCursor[0].length + areaAfterMyCursor[1].length + 1;
    } else if ((((areaBeforeMyCursor[areaBeforeMyCursor.length - 1].length)
      + areaAfterMyCursor[0].length) > 57)) {
      cursor += areaAfterMyCursor[0].length;
    } else {
      cursor += (areaBeforeMyCursor[areaBeforeMyCursor.length - 1].length % 57)
        + areaAfterMyCursor[0].length + 1;
    }
    textarea.setSelectionRange(cursor, cursor);
  } else if (event.code === 'ArrowRight') {
    cursor = textarea.selectionEnd;
    textarea.setSelectionRange(cursor + 1, cursor + 1);
  } else if (event.code === 'CapsLock' || event.code === 'ShiftLeft' || event.code === 'ShiftRight' || event.code === 'ControlLeft' || event.code === 'ControlRight' || event.code === 'AltLeft' || event.code === 'AltRight' || event.code === 'Lang') {
    //
  } else {
    let char = '';
    if ((isCapsed || event.shiftKey) && isRu) {
      char = `${keysObj[event.code].textShiftRu}`;
    }
    if (!(isCapsed || event.shiftKey) && isRu) {
      char = `${keysObj[event.code].textRu}`;
    }
    if ((isCapsed || event.shiftKey) && !isRu) {
      char = `${keysObj[event.code].textShiftEn}`;
    }
    if (!(isCapsed || event.shiftKey) && !isRu) {
      char = `${keysObj[event.code].textEn}`;
    }
    const areaBeforeMyCursor = textarea.value.substring(0, cursor);
    const areaAfterMyCursor = textarea.value.substring(textarea.selectionEnd);
    textarea.value = areaBeforeMyCursor + char + areaAfterMyCursor;
    textarea.setSelectionRange(cursor + 1, cursor + 1);
  }
}

function eventReleased(event) {
  const textarea = document.querySelector('.textarea');
  textarea.focus();
  textarea.removeAttribute('readonly', 'readonly');
  const key = document.getElementById(event.code);
  if (key.classList.contains('pressed')) {
    key.classList.remove('pressed');
  }
  if (event.code === 'ShiftRight' || event.code === 'ShiftLeft') {
    renderKeyboard(isCapsed, isRu);
  }
}

window.onload = () => {
  // создадим генерацию DOM через js
  // header
  const header = document.createElement('header');
  header.className = 'header';
  // title
  const title = document.createElement('pre');
  title.className = 'header-title';
  title.innerHTML = String.raw`
  _____      _             _  __          
 |  __ \    | |           | |/ /          
 | |__) |___| |_ _ __ ___ | ' / ___ _   _ 
 |  _  // _ \ __| '__/ _ \|  < / _ \ | | |
 | | \ \  __/ |_| | | (_) | . \  __/ |_| |
 |_|  \_\___|\__|_|  \___/|_|\_\___|\__, |
                                     __/ |
                                    |___/ 
  `;
  header.appendChild(title);
  // div for info
  const infoDiv = document.createElement('div');
  infoDiv.className = 'header-info';
  header.appendChild(infoDiv);
  // info for p
  const infoLang = document.createElement('p');
  const infoMade = document.createElement('p');
  infoLang.className = 'header-info__lang';
  infoMade.className = 'header-info__made';
  infoLang.innerHTML = 'Change Language: Shift + Alt';
  infoMade.innerHTML = 'Made for: Windows';
  infoDiv.appendChild(infoLang);
  infoDiv.appendChild(infoMade);
  document.body.appendChild(header);
  // textarea
  const textfield = document.createElement('textarea');
  textfield.className = 'textarea';
  document.body.appendChild(textfield);
  const keyboard = document.createElement('div');
  keyboard.className = 'keyboard';
  const arr = new Map();
  //
  Object.keys(keysObj).forEach((key) => {
    if (!arr.has(keysObj[key].row)) {
      const elem = document.createElement('div');
      elem.className = 'keyboard-row';
      arr.set(keysObj[key].row, elem);
      // console.log(arr);
    }
    const myKey = document.createElement('pre');
    myKey.className = 'key';
    myKey.id = `${key}`;
    arr.get(keysObj[key].row).appendChild(myKey);
  });
  arr.forEach((key) => {
    keyboard.appendChild(key);
  });
  document.body.appendChild(keyboard);
  // вызываем local storage + генерируем клавиши
  getLocalStorage();
  // вешаем слушатели на keydown, keyup
  document.addEventListener('keydown', eventPressed);
  document.addEventListener('keyup', eventReleased);

  const key = document.querySelectorAll('.key');
  key.forEach((item) => item.addEventListener('mousedown', (event) => {
    const currentItem = event.target.id;
    eventPressed({
      code: currentItem,
    });
  }));
  key.forEach((item) => item.addEventListener('mouseup', (event) => {
    const currentItem = event.target.id;
    eventReleased({
      code: currentItem,
    });
  }));
  key.forEach((item) => item.addEventListener('mouseleave', (event) => {
    const currentItem = event.target.id;
    eventReleased({
      code: currentItem,
    });
  }));
};
