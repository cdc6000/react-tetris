import React, { Component, Fragment } from "react";

export const strings = {
  ru: {
    langName: "Русский (Russian)",
    locale: "ru-RU",

    mainMenu: {
      menuTitle: "Главное меню",
      tip: "Нажмите${btns|или}для показа окна помощи",

      playBtnTitle: "Играть",
      helpBtnTitle: "Помощь",
      optionsBtnTitle: "Настройки",
      exitBtnTitle: "Выход",
    },

    optionsMenu: {
      menuTitle: "Настройки",
      backBtnTitle: "Вернуться",

      testTab: {
        tabBtnTitle: "Тестовая вкладка",
        testSettingTitle: "Тестовая галочка",
      },

      controlsTab: {
        tabBtnTitle: "Управление",

        main: {
          sectionTitle: "Основные",

          allowFigureMoveByMouse: "Перемещать фигуру с помощью мыши",
        },

        controlScheme: {
          sectionTitle: "Настройка схем управления",

          none: "Нет схем управления",
          new: "Новая схема",
          defaultKeyboard: "Клавиатура (стандартная)",
          defaultMouse: "Мышь (стандартная)",

          checkOverlapsBtnTitle: "Проверить конфликты ввода",
          addBtnTitle: "Добавить",
          removeBtnTitle: "Удалить",
          resetBtnTitle: "Сбросить",
          activeToggleTitle: "Включить схему",

          groupFigureControlTitle: "Управление фигурой",
          groupGameplayTitle: "Игровой процесс",
          groupMiscTitle: "Общее",

          mapInputBtnTitle: "Привязать",
        },

        getInputBlind: {
          awaitingInput: "Ожидание ввода",
          awaitingInputExitTip: "Нажмите ${keyboardKey|f1} для выхода",
          inputRegistered: "Ввод зарегистрирован",
        },

        overlapControlsBlind: {
          foundOverlapsTitle: "Проверьте эти привязки",
          notFoundOverlapsTitle: "Конфликтов не обнаружено",
          backBtnTitle: "Закрыть",
        },
      },
    },

    pauseMenu: {
      menuTitle: "Пауза",
      tipUnpause: "Нажмите${btns|или}для продолжения игры",

      continueBtnTitle: "Продолжить",
      helpBtnTitle: "Помощь",
      optionsBtnTitle: "Настройки",
      restartBtnTitle: "Начать заново",
      exitBtnTitle: "Выход",
    },

    gameOverMenu: {
      menuTitle: "Игра окончена",

      restartBtnTitle: "Начать заново",
      helpBtnTitle: "Помощь",
      exitBtnTitle: "Выход",
    },

    helpMenu: {
      menuTitle: "Помощь",
      tipHelpClose: "Нажмите${btns|или}для закрытия окна помощи",
      backBtnTitle: "Закрыть",
    },

    gameView: {
      tipHelp: "Нажмите${btns|или}для показа окна помощи",
      tipPause: "Нажмите${btns|или}для постановки игры на паузу",

      scoreTitle: "Очки",
      levelTitle: "Уровень",
      nextFigureTitle: "Следующая фигура",
    },

    controlEventName: {
      "control-moveCurrentFigureRight": "Переместить вправо",
      "control-moveCurrentFigureLeft": "Переместить влево",
      "control-rotateCurrentFigureClockwise": "Повернуть по часовой стрелке",
      "control-rotateCurrentFigureCounterclockwise": "Повернуть против часовой стрелки",
      "control-speedUpFallingCurrentFigure": "Ускорить падение",
      "control-dropCurrentFigure": "Опустить до конца",
      "control-gamePause": "Поставить на паузу",
      "control-gameUnpause": "Снять с паузы",
      "control-gamePauseToggle": "Переключить паузу",
      "control-helpMenuToggle": "Меню помощи",
    },

    inputName: {
      "input-mouse": "Мышь",
      "input-mouseLeftButton": "ЛКМ",
      "input-mouseRightButton": "ПКМ",
      "input-mouseWheelUp": "Колесо &#x1F81D;",
      "input-mouseWheelDown": "Колесо &#x1F81F;",
      "input-ArrowLeft": "&#x1F81C;",
      "input-ArrowRight": "&#x1F81E;",
      "input-ArrowUp": "&#x1F81D;",
      "input-ArrowDown": "&#x1F81F;",
      "input-Space": "Пробел",
    },

    inputDescription: {
      "input-mouseLeftButton": "Левая кнопка мыши",
      "input-mouseRightButton": "Правая кнопка мыши",
      "input-mouseWheelUp": "Прокрутка колеса мыши вверх",
      "input-mouseWheelDown": "Прокрутка колеса мыши вниз",
      "input-ArrowLeft": "Стрелка влево",
      "input-ArrowRight": "Стрелка вправо",
      "input-ArrowUp": "Стрелка вверх",
      "input-ArrowDown": "Стрелка вниз",
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
