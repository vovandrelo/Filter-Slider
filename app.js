"use strict";

const filters = document.querySelectorAll(".filter-range");

filters.forEach(filter => {
/* <================================================================================================================> */
/* <================================== ПОЛУЧЕНИЕ НЕОБХОДИМЫХ ДАННЫХ ДЛЯ ТУМБЛЕРОВ ==================================> */
/* <================================================================================================================> */

    // Получение необходимых тумблеров:
    const leftToggle = filter.querySelector('[data-type-toggle="left"]');
    const rightToggle = filter.querySelector('[data-type-toggle="right"]');

    // Подсчёт ширины переключателя:
    const toggleWidth = leftToggle.offsetWidth;

    // Подсчёт минимальных/максимальных положений:
    const minPos = 0;
    const maxPos = filter.offsetWidth;

    // Подсчёт начальных положений:
    let toggleLeftPos = minPos;
    let toggleRightPos = maxPos;

    // Активный переключатель:
    let activeToggle = "none";

    
/* <================================================================================================================> */
/* <================================= ПОЛУЧЕНИЕ НЕОБХОДИМЫХ ДАННЫХ ДЛЯ ПОЛЕЙ ВВОДА =================================> */
/* <================================================================================================================> */

    // Получение необходимых полей ввода:
    const leftInput = filter.querySelector('[data-type-input="left"]');
    const rightInput = filter.querySelector('[data-type-input="right"]');

    // Подсчёт минимальных/максимальных значегий:
    const minValue = +leftInput.dataset.valueMin;
    const maxValue = +rightInput.dataset.valueMax;

    // Подсчёт начальных положений:
    let leftInputValue = minValue;
    let rightInputValue = maxValue;

    // Активное поле ввода:
    let activeInput = "none";

    // Подсчёт минимально-возможной разницы значений:
    const minDiff = Math.ceil((maxValue-minValue) * (toggleWidth / filter.offsetWidth));

/* <================================================================================================================> */
/* <======================================== РЕАЛИЗАЦИЯ НЕОБХОДИМЫХ ФУНКЦИЙ ========================================> */
/* <================================================================================================================> */

/* <================================= ЗАДАНИЕ НАЧАЛЬНОГО ПОЛОЖЕНИЯ ПЕРЕКЛЮЧАТЕЛЯМ ==================================> */

    function startPos() {
        leftToggle.style.left = `${minPos - toggleWidth / 2}px`;
        rightToggle.style.left = `${maxPos - toggleWidth / 2}px`;
    }

/* <=========================================== ДВИЖЕНИЕ ПЕРЕКЛЮЧАТЕЛЕЙ ============================================> */

    function move(event) {
        const newPosition = event.pageX - filter.getBoundingClientRect().left;
        if (activeToggle === "left") {
            if (newPosition <= minPos) {
                toggleLeftPos = minPos;
                leftToggle.style.left = `${toggleLeftPos - toggleWidth / 2}px`;
                connectInputToToggle(toggleLeftPos);
            } else if ((newPosition + toggleWidth) >= toggleRightPos) {
                toggleLeftPos = toggleRightPos - toggleWidth;
                leftToggle.style.left = `${toggleLeftPos - toggleWidth / 2}px`;
                connectInputToToggle(toggleLeftPos);
            } else {
                toggleLeftPos = newPosition;
                leftToggle.style.left = `${toggleLeftPos - toggleWidth / 2}px`;
                connectInputToToggle(toggleLeftPos);
            }
            
        } else if (activeToggle === "right") {
            if (newPosition >= maxPos) {
                toggleRightPos = maxPos;
                rightToggle.style.left = `${toggleRightPos - toggleWidth / 2}px`;
                connectInputToToggle(toggleRightPos);
            } else if ((newPosition - toggleWidth) <= toggleLeftPos) {
                toggleRightPos = toggleLeftPos + toggleWidth;
                rightToggle.style.left = `${toggleRightPos - toggleWidth / 2}px`;
                connectInputToToggle(toggleRightPos);
            } else {
                toggleRightPos = newPosition;
                rightToggle.style.left = `${toggleRightPos - toggleWidth / 2}px`;
                connectInputToToggle(toggleRightPos);
            }
        } else {
            console.log("Что-то сильно пошло не так...");
        }
    }

/* <============================================ ИЗМЕНЕНИЕ ПОЛЕЙ ВВОДА =============================================> */

    function changeInput() {
        if (activeInput === "left") {
            if (+leftInput.value < minValue) {
                leftInputValue = minValue;
                leftInput.value = leftInputValue;
                connectToggleToInput(leftInputValue);
            } else if (+leftInput.value >= rightInputValue - minDiff) {
                leftInputValue = rightInputValue - minDiff;
                leftInput.value = leftInputValue;
                connectToggleToInput(leftInputValue);
            } else {
                leftInputValue = +leftInput.value;
                leftInput.value = leftInputValue;
                connectToggleToInput(leftInputValue);
            }
        } else if (activeInput === "right"){
            if (+rightInput.value > maxValue) {
                rightInputValue = maxValue;
                rightInput.value = rightInputValue;
                connectToggleToInput(rightInputValue);
            } else if (+rightInput.value <= leftInputValue + minDiff) {
                rightInputValue = leftInputValue + minDiff;
                rightInput.value = rightInputValue;
                connectToggleToInput(rightInputValue);
            } else {
                rightInputValue = +rightInput.value;
                rightInput.value = rightInputValue;
                connectToggleToInput(rightInputValue);
            }
        } else {
            console.log("Что-то сильно пошло не так...");
        }
    }
/* <========================= УСТАНОВКА ЗАВВИСИМОСТЕЙ МЕЖДУ ПОЛЯМИ ВВОДА И ПЕРЕКЛЮЧАТЕЛЯМИ =========================> */

    // Установка полей ввода на основании переключателей:
    function connectInputToToggle(newPosition) {
        const relation = newPosition / maxPos;
        if (activeToggle === "left") {
            leftInputValue = Math.round(relation * (maxValue - minValue)) + minValue;
            leftInput.value = leftInputValue;
        } else if (activeToggle === "right") {
            rightInputValue = Math.round(relation * (maxValue - minValue)) + minValue;
            rightInput.value = rightInputValue;
        } else {
            console.log("Что-то сильно пошло не так...");
        }
    }

    function connectToggleToInput(newValue) {
        const relation = (newValue - minValue) / (maxValue - minValue);
        if (activeInput === "left") {
            toggleLeftPos = maxPos * relation;
            leftToggle.style.left = `${toggleLeftPos - toggleWidth / 2}px`;
        } else if (activeInput === "right") {
            toggleRightPos = maxPos * relation;
            rightToggle.style.left = `${toggleRightPos - toggleWidth / 2}px`;
        } else {
            console.log("Что-то сильно пошло не так...");
        }
    }

/* <================================================================================================================> */
/* <================================================== РЕАЛИЗАЦИЯ ==================================================> */
/* <================================================================================================================> */

    // Установка начальных значений:
    startPos(leftToggle);
    startPos(rightToggle);

    // Реализация работы левого переключателя:
    leftToggle.addEventListener("mousedown", event => {         // При клике на переключатель:
        activeToggle = "left";                                  //  - Выбираем активный переключатель
        move(event);                                            //  - Устанавливаем переключатель по центру курсора
        document.addEventListener("mousemove", move);           //  - Пока мышка двигается, двигаем переключатель
        document.addEventListener("mouseup", () => {            //  - Когда клавишу будет отпущена:
            activeToggle = "none";                              //    - Убираем активный переключатель
            document.removeEventListener("mousemove", move);    //    - Останавливаем движение переключателя
        });
    });
    // Реализация работы правого переключателя:
    rightToggle.addEventListener("mousedown", event => {
        activeToggle = "right";                                 //  - Выбираем активный переключатель
        move(event, rightToggle);                               //  - Устанавливаем переключатель по центру курсора
        document.addEventListener("mousemove", move);           //  - Пока мышка двигается, двигаем переключатель
        document.addEventListener("mouseup", () => {            //  - Когда клавишу будет отпущена:
            activeToggle = "none";                              //    - Убираем активный переключатель
            document.removeEventListener("mousemove", move);    //    - Останавливаем движение переключателя
        });
    });



    leftInput.addEventListener("input", () => {
        activeInput = "left";
        leftInput.value = leftInput.value.replace(/\D/g, '');
    });
    leftInput.addEventListener("change", () => {
        activeInput = "left";
        changeInput();
    });
    rightInput.addEventListener("input", () => {
        activeInput = "right";
        rightInput.value = rightInput.value.replace(/\D/g, '');
    });
    rightInput.addEventListener("change", () => {
        activeInput = "right";
        changeInput();
    });
});