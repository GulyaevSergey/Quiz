// Объект с сохраненными ответами
const answers = {
    2: null,
    3: null,
    4: null,
    5: null
}

// Движение вперед
const btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button){
    button.addEventListener("click", function(){
        let thisCard = this.closest("[data-card]");
        let thisCardNumber = parseInt(thisCard.dataset.card);
            
        if (thisCard.dataset.validate == "novalidate" ) {
            navigate("next", thisCard);
        } else {

            // При движении вперед сохраняем данные в объект
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

            // Валидация на заполненность
            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)){
                navigate("next", thisCard);
            } else {
                alert("Сделайте ответ, прежде чем переходить далее");
            }
        }     
    });
});

// Движение назад
const btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button){
    button.addEventListener("click", function(){
        const thisCard = this.closest("[data-card]");

        navigate("prev", thisCard);

    })
})

function navigate(direction, thisCard) {
    const thisCardNumber = parseInt(thisCard.dataset.card);
    var nextCard;

    if(direction == "next") {
        nextCard = thisCardNumber + 1;
    } else if (direction == "prev") {
        nextCard = thisCardNumber - 1;
    }

    thisCard.classList.add("hidden");
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove("hidden");
}

// Функция сбора заполненных данных
function gatherCardData(number){

    let question;
    let result = [];

    // Находим карточку по номеру и дата-атрибуту
    const currentCard = document.querySelector(`[data-card="${number}"]`);

    // Находим главный вопрос карточки
    question = currentCard.querySelector("[data-question]").innerText;

    // Находим все заполненные значения из радиокнопок
    const radioValues = currentCard.querySelectorAll('[type="radio"]');

    radioValues.forEach(function(item){

        if (item.checked){
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    // Находим все заполненные значения из чекбоксов
    let ckeckBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
    ckeckBoxValues.forEach(function(item){
        if (item.checked){
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    // Находим все заполненные значения из инпутов
    let inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
    inputValues.forEach(function(item){
        itemValue = item.value;
        if (itemValue.trim() != ""){
            result.push({
                name: item.name,
                value: item.value
            });
        }   
    })
    

    let data = {
        question: question,
        answer: result
    };

    return data;    
}

// Функция записи ответов в объект
function saveAnswer(number, data){
    answers[number] = data
} 


function isFilled(number){
    if (answers[number].answer.length > 0){
        return true;
    } else {
        return false;
    }
}   

function validateEmail(email) {
    let pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}

// Проверка на заполненность required чекбоксов и инпутов с email
function checkOnRequired(number){
    let currentCard = document.querySelector(`[data-card="${number}"]`);
    let requiredFields = currentCard.querySelectorAll("[required]");

    let isValidArray = [];

    requiredFields.forEach(function(item){
        if (item.type == "checkbox" && item.checked == false){
            isValidArray.push(false);
        } else if (item.type == "email") {
            if (validateEmail(item.value)) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }
        }
    });

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false
    }
}