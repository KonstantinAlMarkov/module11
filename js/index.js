let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

const fruitColors = new Map([["фиолетовый","violet"],["зеленый","green"],["розово-красный","carmazin"],["желтый","yellow"],["светло-коричневый","lightbrown"]]);
const colorWeights = new Map([["фиолетовый", 5],["зеленый",4],["розово-красный",1],["желтый",3],["светло-коричневый",2]]);

let fruits = JSON.parse(fruitsJSON);

const fruitListUL = document.getElementById('fruits_list');  

function udateColorField(){
  const selectFields=document.getElementById('selectpicker');
  const colorKeys = fruitColors.keys();

  for(let color of colorKeys){
      let newColorSelection = document.createElement("option");
      newColorSelection.innerHTML = color;
      selectFields.appendChild(newColorSelection);
  }
}

//_____________________
// ОТОБРАЖЕНИЕ
function createFruitDisplay(fruitIndex, fruitKind, fruitColor, fruitWeight){
  var newLi = document.createElement("li");
  if (fruitColors.has(fruitColor)){
    newLi.className = `fruit__item fruit_${fruitColors.get(fruitColor)}`;
  } else newLi.className = `fruit__item fruit_black`;
  var newTopDiv = document.createElement("div");
  newTopDiv.className = ("fruit__info");
  var newfruitIndexDiv = document.createElement("div");
  newfruitIndexDiv.innerHTML = (fruitIndex);
  var newfruitKindDiv = document.createElement("div");
  newfruitKindDiv.innerHTML = (fruitKind); 
  var newfruitColorDiv = document.createElement("div");
  newfruitColorDiv.innerHTML = (fruitColor);  
  var newfruitWeightDiv = document.createElement("div");
  newfruitWeightDiv.innerHTML = (fruitWeight);
  newTopDiv.appendChild(newfruitIndexDiv); 
  newTopDiv.appendChild(newfruitKindDiv); 
  newTopDiv.appendChild(newfruitColorDiv); 
  newTopDiv.appendChild(newfruitWeightDiv); 
  newLi.appendChild(newTopDiv);
  fruitListUL.appendChild(newLi);
}

function clearFruitDisplay(){
  fruitListUL.innerHTML = "";
}

const display = (arr) => {
  clearFruitDisplay();
  const fruitsList = $('.fruits__list');
  for (let i = 0; i < arr.length; i++) {
    createFruitDisplay(i, arr[i].kind, arr[i].color, arr[i].weight);
  }
};

// первая отрисовка карточек
display(fruits);
//_____________________
// ПЕРЕМЕШИВАНИЕ

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = (arr) => {
  let result = [];

  while (arr.length > 0) {
    let tmpVal = getRandomInt(0,arr.length-1);
    result.splice(result.length,1,arr[tmpVal]);
    arr.splice(tmpVal,1);
  }
  for (let i=0; i < result.length; i++){arr.push(result[i]);}
};

$('.shuffle__btn').click((e) => {
  shuffleFruits(fruits);
  if(fruits.length==0) alert("Перемешать не удалось");
  display(fruits);
});

//_____________________
// ФИЛЬТРАЦИЯ

// фильтрация массива
const filterFruits = (arr) => {
  let minVal = (document.getElementById('minInp').value === "") ? 0 : document.getElementById('minInp').value;
  let maxVal = (document.getElementById('maxInp').value === "") ? 1000000000 : document.getElementById('maxInp').value; 
  if(isNaN(minVal)){
      minVal=0;
  }
  if(isNaN(maxVal)){
    maxVal=1000000000;
  }

  const filtered = arr.filter(function (e){
    return (e.weight > minVal && e.weight < maxVal);  
  });
  return filtered;
 /* arr.filter((item) => {
    return arr.weight > document.getElementById('minInp').value;  
  }); */
};

$('.filter__btn').click((e) => {
  //filterFruits(fruits);
  display(filterFruits(fruits));
});

//_____________________
// СОРТИРОВКА

// инициализация состояния
let sortKind = 'bubbleSort';
let sortTime = '-';

// сравнение двух элементов
const comparationColor = (a, b) => {
  const colorA = colorWeights.get(a.color);
  const colorB = colorWeights.get(b.color);  
  return (colorA > colorB)?true:false;
};

// API блока сортировки
const sortAPI = {
  // вывести название сортировки
  setSortKind() {
    $('.sort__kind').text(sortKind);
  },

  // получить название сортировки
  getSortKind() {
    return sortKind;
  },

  // вывести время сортировки
  setSortTime() {
    $('.sort__time').text(sortTime);
  },

  // сортировка пузырьком
  bubbleSort(arr, comparation) 
  {
   const n = arr.length;
   // внешняя итерация по элементам
   for (let i = 0; i < n-1; i++) { 
       // внутренняя итерация для перестановки элемента в конец массива
       for (let j = 0; j < n-1-i; j++) { 
           // сравниваем элементы
           if (comparation(arr[j], arr[j+1])) { 
               // делаем обмен элементов
               let temp = arr[j+1]; 
               arr[j+1] = arr[j]; 
               arr[j] = temp; 
           }
       }
    }
  },

  quickSort(arr, low, high, comparation) {
      var i = low;                
      var j = high;
      var middle = arr[Math.round(( low + high )/2)];
    
      do {
        //while(arr[i] < middle)
        while(comparation(middle, arr[i]))
          {
            ++i;
          } 

        //while(arr[j] > middle)
        while(comparation(arr[j], middle))
        {
            --j;
        }   

        //if(i <= j){ 
        if(!comparation(arr[j], arr[i])){          
          var temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          i++; j--;
        }
      } 
      //while(i < j);
      while(comparation(arr[j], arr[i]));
      
      if(low < j){
        sortAPI.quickSort(arr, low, j, comparation);    
      } 

      if(i < high){
        sortAPI.quickSort(arr, i, high, comparation);
      } 
  },

  // выполняет сортировку и производит замер времени
  startSort(currentSort, arr, currentComparation) {
    const start = new Date().getTime();
    //currentSort(arr, currentComparation);
    (sortAPI.getSortKind() === `bubbleSort`) ? currentSort(arr, currentComparation):currentSort(arr, 0, arr.length-1, currentComparation); 
    const end = new Date().getTime();
    return `${end - start} ms`;
  },
};

// инициализация полей при первом запуске ПО
sortAPI.setSortKind();
sortAPI.setSortTime();

$('.sort__action__btn').click((e) => {
  const sortKind = sortAPI.getSortKind();
  const currentSort = sortAPI[sortKind];
  const currentComparation = comparationColor;
  const timeSorting = sortAPI.startSort(currentSort, fruits, currentComparation);
  display(fruits);
  sortTime = timeSorting;
  sortAPI.setSortTime();
});

$('.sort__change__btn').click((e) => {
  sortKind = (sortAPI.getSortKind() === `bubbleSort`)?`quickSort`:'bubbleSort'; 
  sortAPI.setSortKind();
});

//_____________________
// ДОБАВИТЬ ФРУКТ

// создание и добавление нового фрукта
const addFruit = () => {
  let newFruit = {};
  newFruit.kind = document.getElementById('kind__input').value;
  newFruit.color = document.getElementById('selectpicker').value;
  newFruit.weight = parseInt(document.getElementById('weight__input').value);

  if(newFruit.kind==""||newFruit.color==""||newFruit.weight==""){
    alert("Не заполнены все поля");
  } else {
    fruits.push(newFruit);
    display(fruits);
  }
};

$('.add__action__btn').click((e) => addFruit());


window.onload = function()
{
  udateColorField();
  //  updateFormFields(person);
};