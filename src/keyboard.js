/* eslint-disable import/extensions */
import keysObj from './keys.js';
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
  console.log(symbol);
  return symbol;
}
function renderKeyboard(Shift, Ru) {
  Object.keys(keysObj).forEach((key) => {
    const myKey = document.getElementById(key);
    if (Shift === false && Ru === true) {
      myKey.innerHTML = printWindowKeys(keysObj[key].width, keysObj[key].height, keysObj[key].textRu);
    }
    if (Shift === true && Ru === true) {
      myKey.innerHTML = printWindowKeys(keysObj[key].width, keysObj[key].height, keysObj[key].textShiftRu);
    }
    if (Shift === false && Ru === false) {
      myKey.innerHTML = printWindowKeys(keysObj[key].width, keysObj[key].height, keysObj[key].textEn);
    }
    if (Shift === true && Ru === false) {
      myKey.innerHTML = printWindowKeys(keysObj[key].width, keysObj[key].height, keysObj[key].textShiftEn);
    }
  });
  // for (const key in keysObj) {
  //   // const myKey = document.getElementById(key);
  //   if (Shift === false && Ru === true) {
  //     myKey.innerHTML = printWindowKeys(keysObj[key].width, keysObj[key].height, keysObj[key].textRu);
  //   }
  //   if (Shift === true && Ru === true) {
  //     myKey.innerHTML = printWindowKeys(keysObj[key].width, keysObj[key].height, keysObj[key].textShiftRu);
  //   }
  //   if (Shift === false && Ru === false) {
  //     myKey.innerHTML = printWindowKeys(keysObj[key].width, keysObj[key].height, keysObj[key].textEn);
  //   }
  //   if (Shift === true && Ru === false) {
  //     myKey.innerHTML = printWindowKeys(keysObj[key].width, keysObj[key].height, keysObj[key].textShiftEn);
  //   }
  // }
}

let isCapsed = false;
let isRu = true;

const textarea = document.querySelector('.textarea');

function eventPressed(event) {
  // отключим поведение таба по умолчанию
  if (event.key === 'Tab') {
    event.preventDefault();
  }
  textarea.setAttribute('readonly', 'readonly');
  const one = document.getElementById(event.code);
  one.classList.add('pressed');
  // TODO Сделать так чтобы клавиши могли быть "зажаты" при удерживании мышкой
  // if (event.code && one.classList.contains('pressed')) {

  // }
  console.log(event);
  if (event.code === 'ShiftRight' || event.code === 'ShiftLeft') {
    renderKeyboard(!isCapsed, isRu);
  }
  if (event.code === 'CapsLock') {
    isCapsed = !isCapsed;
    renderKeyboard(isCapsed, isRu);
  }
  if (event.shiftKey && event.altKey || event.code === 'AltRight' && event.shiftKey || event.code === 'Lang') {
    isRu = !isRu;
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

    //
  } else if (event.code === 'Tab') {
    // event.code.preventDefault();
    textarea.value += '\t';
    // todo + space
  } else if (event.code === 'Enter') {
    textarea.value += '\n';
    // todo enter
  } else if (event.code === 'Space') {
    textarea.value += ' ';
    // todo + space
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
    if ((isCapsed ^ event.shiftKey) && isRu) {
      char = `${keysObj[event.code].textShiftRu}`;
    }
    if (!(isCapsed ^ event.shiftKey) && isRu) {
      char = `${keysObj[event.code].textRu}`;
    }
    if ((isCapsed ^ event.shiftKey) && !isRu) {
      char = `${keysObj[event.code].textShiftEn}`;
    }
    if (!(isCapsed ^ event.shiftKey) && !isRu) {
      char = `${keysObj[event.code].textEn}`;
    }
    const areaBeforeMyCursor = textarea.value.substring(0, cursor);
    const areaAfterMyCursor = textarea.value.substring(textarea.selectionEnd);
    textarea.value = areaBeforeMyCursor + char + areaAfterMyCursor;
    textarea.setSelectionRange(cursor + 1, cursor + 1);
  }
}

function eventReleased(event) {
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
  // todo сгенерить html
  renderKeyboard(isCapsed, isRu);
  document.addEventListener('keydown', eventPressed);
  document.addEventListener('keyup', eventReleased);
};

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

// function print(width, height, text, id) {
//   let str = `<div class = "key" id = "${id}">\n`;
//   str += printWindowKeys(width, height, text);
//   str += '</div>\n';
//   return str;
// }
// let keyboard = document.querySelector('.keyboard');
// function create() {
//   let str = '';
//   str += '<div style="display: flex; position: relative; height: 60px">\n';
//   for (let i = 0; i < 9; i += 1) {
//     str += print(5, 5, `${i}`, `Key${i}`);
//   }
//   str += '</div>\n';
//   keyboard.innerHTML = str;
// }
//
// поменять размеры
// console.log(keysObj.digit1);

// function init() {
//   let body = document.getElementsByTagName('body');

// }