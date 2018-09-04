//ГЛАВНЫЕ ГЛОБАЛЬЫЕ КОНСТАНТЫ: канвас, контекст, середина канвас
const myCanvas = document.querySelector("#canvas");
var ctx = myCanvas.getContext("2d");
const zero_x = myCanvas.width / 2;
const zero_y = myCanvas.height / 2;

//чекбокс, по которому определяем режим работы
const chBox = document.querySelector("#mode");

//функция, которая просто перегружает страницу заново, если режим меняется
function modeChange() {
    location.reload();
}

//вспомогательные константы - все кнопки и инпуты, с которыми будем работать
const createButton = document.querySelector("#btn_create");
const plusButton = document.querySelector("#btn_plus");
const minusButton = document.querySelector("#btn_minus");
const colorInput = document.querySelector("#color");
const titleInput = document.querySelector("#title");
const xInput = document.querySelector("#x_coor");
const yInput = document.querySelector("#y_coor");
const selectLeft = document.querySelector("#slc_left");
const selectRight = document.querySelector("#slc_right");

//массив, в который будем складывать построенные векторы
let vectors = [];

//конструктор вектора с методом отрисовки
function vector(name, x, y, color) {
    this.name = name;
    this.x = convertTO_X(x);
    this.y = convertTO_Y(y);
    this.draw = function () {
        ctx.beginPath();
        ctx.moveTo(zero_x, zero_y);

        ctx.lineWidth = 5;
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

//в зависимости от режима работы, вешаем один или второй обработчик на кнопки плюс и минус
if (chBox.checked == true) {
    plusButton.addEventListener('click', plusButtonHandlerMode2);
    minusButton.addEventListener('click', minusButtonHandlerMode2);
} else {
    plusButton.addEventListener('click', plusButtonHandlerMode1);
    minusButton.addEventListener('click', minusButtonHandlerMode1);
}

//вешаем обработчик на кнопку "создать": парсим цвет, название и координаты, создаем обьект
//добавляем его в массив векторов, вызываем его метод для отрисовки, 
//потом очищаем и заново записываем элементы правый и левый select
//а также на всякий случай очищаем введенные данные
createButton.addEventListener('click', function () {
    let name = titleInput.value;
    if (IsNotExists(name)) {
        let color = colorInput.value;
        let x = parseInt(xInput.value);
        let y = parseInt(yInput.value);
        if (name != "" && !isNaN(x) && !isNaN(y) && (x > -374 && x < 374) && (y > -374 && y < 374)) {
            let newVector = new vector(name, x, y, color);
            vectors.push(newVector);
            newVector.draw();
            clearSelect(selectLeft);
            clearSelect(selectRight);
            writeSelect(selectLeft);
            writeSelect(selectRight);
            titleInput.value = "";
            xInput.value = "";
            yInput.value = "";
        }
    }
})

//обработчик для кнопки сложения векторов в режиме 2
function plusButtonHandlerMode2() {
    let vector_left_name = selectLeft.value;
    let vector_right_name = selectRight.value;
    let vector_left;
    let vector_right;
    for (let i = 0; i < vectors.length; i++) {
        if (vectors[i].name == vector_left_name) {
            vector_left = vectors[i];
        }
    }
    for (let i = 0; i < vectors.length; i++) {
        if (vectors[i].name == vector_right_name) {
            vector_right = vectors[i];
        }
    }
    add_vectors(vector_left, vector_right);
    spliceByName(vector_left_name);
    spliceByName(vector_right.name);
    clearSelect(selectLeft);
    clearSelect(selectRight);
    writeSelect(selectLeft);
    writeSelect(selectRight);
    drawVectors();
}

//обработчик для кнопки сложения векторов в режиме 1
function plusButtonHandlerMode1() {
    let vector_left_name = selectLeft.value;
    let vector_right_name = selectRight.value;
    let vector_left;
    let vector_right;
    for (let i = 0; i < vectors.length; i++) {
        if (vectors[i].name == vector_left_name) {
            vector_left = vectors[i];
        }
    }
    for (let i = 0; i < vectors.length; i++) {
        if (vectors[i].name == vector_right_name) {
            vector_right = vectors[i];
        }
    }
    add_vectors(vector_left, vector_right);
    vectors[vectors.length - 1].draw();
    clearSelect(selectLeft);
    clearSelect(selectRight);
    writeSelect(selectLeft);
    writeSelect(selectRight);
}

//обработчик для кнопки вычитания векторов в режиме 1
function minusButtonHandlerMode1() {
    let vector_left_name = selectLeft.value;
    let vector_right_name = selectRight.value;
    let vector_left;
    let vector_right;
    for (let i = 0; i < vectors.length; i++) {
        if (vectors[i].name == vector_left_name) {
            vector_left = vectors[i];
        }
        if (vectors[i].name == vector_right_name) {
            vector_right = vectors[i];
        }
    }
    sub_vectors(vector_left, vector_right);
    vectors[vectors.length - 1].draw();
    clearSelect(selectLeft);
    clearSelect(selectRight);
    writeSelect(selectLeft);
    writeSelect(selectRight);
}

//обработчик для кнопки вычитания векторов в режиме 2
function minusButtonHandlerMode2() {
    let vector_left_name = selectLeft.value;
    let vector_right_name = selectRight.value;
    let vector_left;
    let vector_right;
    for (let i = 0; i < vectors.length; i++) {
        if (vectors[i].name == vector_left_name) {
            vector_left = vectors[i];
        }
        if (vectors[i].name == vector_right_name) {
            vector_right = vectors[i];
        }
    }
    add_vectors(vector_left, vector_right);
    spliceByName(vector_left_name);
    spliceByName(vector_right.name);
    clearSelect(selectLeft);
    clearSelect(selectRight);
    writeSelect(selectLeft);
    writeSelect(selectRight);
    drawVectors();
}

//метод сложения векторов
function add_vectors(vector_left, vector_right) {
    let color = colorInput.value;
    let name = vector_left.name + "+" + vector_right.name;
    let newVector = new vector(name,
        convert_FROM_X(vector_left.x) + convert_FROM_X(vector_right.x),
        convert_FROM_Y(vector_left.y) + convert_FROM_Y(vector_right.y), color);
    vectors.push(newVector);
}

//метод вычитания векторов
function sub_vectors(vector_left, vector_right) {
    let color = colorInput.value;
    let name = vector_left.name + "-" + vector_right.name;
    let newVector = new vector(name,
        convert_FROM_X(vector_left.x) - convert_FROM_X(vector_right.x),
        convert_FROM_Y(vector_left.y) - convert_FROM_Y(vector_right.y), color);
    vectors.push(newVector);
}

//ВСПОМОГАТИЛЬНЫЕ ФУНКЦИИ:
//конвертация введенных пользователем координат в координаты canvas - чтобы векторы строились из центра
function convertTO_X(x) {
    return zero_x + x;
}

function convertTO_Y(y) {
    return zero_y - y;
}
//обратная конвертация - вроде бы нужна, чтобы корректно вычесть/сложить и построить результирующий вектор
function convert_FROM_X(x) {
    return x - zero_x;
}

function convert_FROM_Y(y) {
    return zero_y - y;
}

//наполнение select всеми векторами, которые есть в массиве. Принимает DOM элемент, то есть один из select
function writeSelect(elem) {
    vectors.forEach(item => {
        let option = document.createElement("option");
        option.text = item.name;
        elem.add(option);
    })

}
//очистка элемента select от всех элементов. Принимает DOM элемент
function clearSelect(elem) {
    while (elem.hasChildNodes()) {
        elem.removeChild(elem.firstChild);
    }
}

//очистка canvas от всех векторов и отрисовка заново
function drawVectors() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    vectors.forEach(item => {
        item.draw();
    })
}

//удаление вектора из массива по его названию. Нужен для режима 2
function spliceByName(name) {
    let i = 0;
    for (; i < vectors.length; i++) {
        if (name == vectors[i].name) break;
    }
    if (i < vectors.length) {
        vectors.splice(i, 1);
    }
}

//проверка существования вектора с таким именем
function IsNotExists(name) {
    let i = 0;
    for (; i < vectors.length; i++) {
        if (name == vectors[i].name) break;
    }
    return i == vectors.length;
}
