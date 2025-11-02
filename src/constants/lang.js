export const strings = {
  ru: {
    langName: "Русский (Russian)",
    locale: "ru-RU",

    mainMenu: {
      playBtnTitle: "Играть",
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

          addBtnTitle: "Добавить",
          removeBtnTitle: "Удалить",
          resetBtnTitle: "Сбросить",
          activeToggleTitle: "Включить схему",

          groupFigureControlTitle: "Управление фигурой",
          groupGameplayTitle: "Игровой процесс",

          mapInputBtnTitle: "Привязать",
        },

        getInputBlind: {
          awaitingInput: "Ожидание ввода",
          awaitingInputExitTip: "Нажмите ${keyboardKey|f1} для выхода",
          inputRegistered: "Ввод зарегистрирован",
        },
      },
    },

    pauseMenu: {
      menuTitle: "Пауза",

      continueBtnTitle: "Продолжить",
      optionsBtnTitle: "Настройки",
      restartBtnTitle: "Начать заного",
      exitBtnTitle: "Выход",
    },

    gameOverMenu: {
      menuTitle: "Игра окончена",
    },

    gameView: {
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
    },

    inputName: {
      "input-mouseLeftButton": "Левая кнопка мыши",
      "input-mouseRightButton": "Правая кнопка мыши",
      "input-mouseWheelUp": "Колесо мыши вверх",
      "input-mouseWheelDown": "Колесо мыши вниз",
      "input-ArrowLeft": "Стрелка влево",
      "input-ArrowRight": "Стрелка вправо",
      "input-ArrowUp": "Стрелка вверх",
      "input-ArrowDown": "Стрелка вниз",
      "input-Space": "Пробел",
    },
  },
};

export const getString = ({ lang, pathArray }) => {
  let elem = strings[lang];
  if (!elem) return false;
  pathArray.some((key) => {
    elem = elem[key];
    if (elem == undefined) return true;
  });
  return elem;
};

export function stringConverter(text, conversionList = []) {
  const textBlock = [text];
  let blockUniqueKey = 0;

  conversionList.forEach((data) => {
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
