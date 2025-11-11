import React, { Component, Fragment } from "react";

import * as controls from "./controls";

export const strings = {
  ru: {
    langName: "Русский (Russian)",
    locale: "ru-RU",

    mainMenu: {
      menuTitle: "Главное меню",

      playBtnTitle: "Играть",
      helpBtnTitle: "Помощь&nbsp;${btns|или}",
      optionsBtnTitle: "Настройки",
      exitBtnTitle: "Выход",
    },

    optionsMenu: {
      menuTitle: "Настройки",
      backBtnTitle: "Назад&nbsp;${btns|или}",

      testTab: {
        tabBtnTitle: "Тестовая вкладка",
        testSettingTitle: "Тестовая галочка",
      },

      controlsTab: {
        tabBtnTitle: "Управление",

        main: {
          sectionTitle: "Основные",

          allowFigureMoveByMouse: "Перемещать фигуру с помощью мыши",
          inputRepeatDelayInputTitle: "Задерка повтороения ввода",
          inputRepeatRateInputTitle: "Частота повторения ввода",
        },

        controlScheme: {
          sectionTitle: "Настройка схем управления",

          none: "Нет схем управления",
          custom: "Своя",
          defaultKeyboard: "Клавиатура",
          defaultMouse: "Мышь",

          selectTitle: "Выберите схему управления",

          groupAnyMenuTitle: "Навигация по меню",
          groupFigureControlTitle: "Управление фигурой",
          groupGameplayTitle: "Игровой процесс",
          groupMiscTitle: "Общее",
        },
      },
    },

    getInputMenu: {
      awaitingInput: "Ожидание ввода",
      awaitingInputExitTip: "Отмена&nbsp;${btns|или}",
      inputRegistered: "Ввод зарегистрирован",
    },

    overlapControlsMenu: {
      foundOverlapsTitle: "Проверьте эти привязки",
      notFoundOverlapsTitle: "Конфликтов не обнаружено",
      backBtnTitle: "Закрыть&nbsp;${btns|или}",
    },

    selectMenu: {
      backBtnTitle: "Отмена&nbsp;${btns|или}",
    },

    pauseMenu: {
      menuTitle: "Пауза",

      continueBtnTitle: "Продолжить&nbsp;${btns|или}",
      helpBtnTitle: "Помощь&nbsp;${btns|или}",
      optionsBtnTitle: "Настройки",
      restartBtnTitle: "Начать заново",
      exitBtnTitle: "Выход",
    },

    gameOverMenu: {
      menuTitle: "Игра окончена",

      restartBtnTitle: "Начать заново",
      helpBtnTitle: "Помощь&nbsp;${btns|или}",
      exitBtnTitle: "Выход",
    },

    helpMenu: {
      menuTitle: "Помощь",
      backBtnTitle: "Закрыть&nbsp;${btns|или}",
    },

    gameView: {
      tipHelp: "Помощь&nbsp;${btns|или}",
      tipPause: "Пауза&nbsp;${btns|или}",

      scoreTitle: "Очки",
      levelTitle: "Уровень",
      nextFigureTitle: "Следующая фигура",
    },

    controlEventName: {
      [controls.controlEvent.menuNavUp]: "Вверх",
      [controls.controlEvent.menuNavDown]: "Вниз",
      [controls.controlEvent.menuNavLeft]: "Влево",
      [controls.controlEvent.menuNavRight]: "Вправо",
      [controls.controlEvent.menuNavSelect]: "Выбор",
      [controls.controlEvent.menuNavBack]: "Назад",

      [controls.controlEvent.moveCurrentFigureRight]: "Переместить вправо",
      [controls.controlEvent.moveCurrentFigureLeft]: "Переместить влево",
      [controls.controlEvent.rotateCurrentFigureClockwise]: "Повернуть по часовой стрелке",
      [controls.controlEvent.rotateCurrentFigureCounterclockwise]: "Повернуть против часовой стрелки",
      [controls.controlEvent.speedUpFallingCurrentFigure]: "Ускорить падение",
      [controls.controlEvent.dropCurrentFigure]: "Опустить до конца",

      [controls.controlEvent.gamePause]: "Поставить на паузу",
      [controls.controlEvent.gameUnpause]: "Снять с паузы",
      [controls.controlEvent.gamePauseToggle]: "Переключить паузу",

      [controls.controlEvent.helpMenuToggle]: "Меню помощи",
    },

    inputName: {
      [controls.input.mouse]: "Мышь",
      [controls.input.mouseLeftButton]: "ЛКМ",
      [controls.input.mouseRightButton]: "ПКМ",
      [controls.input.mouseWheelUp]: "Колесо &#x1F81D;",
      [controls.input.mouseWheelDown]: "Колесо &#x1F81F;",
      [controls.input.arrowLeft]: "&#x1F81C;",
      [controls.input.arrowRight]: "&#x1F81E;",
      [controls.input.arrowUp]: "&#x1F81D;",
      [controls.input.arrowDown]: "&#x1F81F;",
      [controls.input.space]: "Пробел",
      [controls.input.esc]: "Esc",
    },

    inputDescription: {
      [controls.input.mouseLeftButton]: "Левая кнопка мыши",
      [controls.input.mouseRightButton]: "Правая кнопка мыши",
      [controls.input.mouseWheelUp]: "Прокрутка колеса мыши вверх",
      [controls.input.mouseWheelDown]: "Прокрутка колеса мыши вниз",
      [controls.input.arrowLeft]: "Стрелка влево",
      [controls.input.arrowRight]: "Стрелка вправо",
      [controls.input.arrowUp]: "Стрелка вверх",
      [controls.input.arrowDown]: "Стрелка вниз",
    },
  },
};

export const getLangString = ({ lang, pathArray }) => {
  let elem = strings[lang];
  if (!elem) {
    elem = { string: `${lang}.${pathArray.join(".")}`, notFound: true };
  } else {
    pathArray.some((key, kIndex) => {
      elem = elem[key];
      if (elem == undefined) {
        if (kIndex <= pathArray.length - 1) {
          elem = { string: `${lang}.${pathArray.join(".")}`, notFound: true };
        }
        return true;
      } else if (kIndex == pathArray.length - 1) {
        elem = { string: elem };
      }
    });
  }
  return elem;
};

export function stringConverter(text, conversionList = []) {
  const textBlock = [text];
  let blockUniqueKey = 0;

  [
    ...conversionList,
    {
      type: "function",
      whatIsRegExp: true,
      what: `\\&([^\\;]+)\\;`,
      to: (key, matchData) => (
        <span
          key={key}
          className="unicode-symbol"
          dangerouslySetInnerHTML={{ __html: `&${matchData[1]};` }}
        />
      ),
    },
  ].forEach((data) => {
    if (!data?.type) return;

    switch (data.type) {
      case "string": {
        for (let i = textBlock.length - 1; i >= 0; i--) {
          textBlock[i] = ("" + textBlock[i]).replaceAll("${" + data.what + "}", data.to);
        }

        break;
      }

      case "function": {
        for (let i = 0; i < textBlock.length; i++) {
          const txt = "" + textBlock[i];
          const matchData =
            data.whatIsRegExp ? txt.match(new RegExp(data.what)) : txt.match(new RegExp("\\$\\{" + data.what + "\\}"));
          if (matchData) {
            textBlock.splice(
              i,
              1,
              txt.slice(0, matchData.index),
              data.to(blockUniqueKey++, matchData),
              txt.slice(matchData.index + matchData[0].length)
            );
          }
        }

        break;
      }
    }
  });

  return textBlock;
}

export function getLangStringConverted({ lang, pathArray, conversionList }) {
  const result = getLangString({ lang, pathArray });
  if (result.notFound) {
    return result.string;
  } else {
    return stringConverter(result.string, conversionList);
  }
}
