import { HTMLQUIZ, CSSQUIZ, JSQUIZ, loadQuestionsPromise } from "./quizes.js";

let quiz = new Map();
let currentQuestion = 0;
let question;
let score = 0;
let isAnswered = false;
const answers = document.getElementById("quiz-answer-wrapper");
let timerInterval;
const totalTime = 2;

function verifyAnswer(selected, answer){
    currentQuestion++;
    for(let i = 0; i <= 3; i++){
        if(i === selected && selected === answer){
            score++;
            document.getElementById(selected).classList.add('selected-correctly');
        }
        else if(i === selected){
            document.getElementById(selected).classList.add('selected');
            document.getElementById(answer).classList.add('correct');
        }
        else if(i === answer){
            document.getElementById(answer).classList.add('correct');
        }
        else{
            document.getElementById(i).classList.add('wrong');
        }
    }
    isAnswered = true;
}

function handleUserChoice(evt) {
    if (isAnswered) return;

    const target = evt.target.closest(".quiz-answer");
    if (target && target.classList.contains("quiz-answer")) {
        const buttonID = parseInt(target.id); 
        verifyAnswer(buttonID, question.answer)
        clearInterval(timerInterval);
        updateScore();
        changequestion();
    }
};

function loadquestion(){
    isAnswered = false;
    clearInterval(timerInterval);
    document.getElementById("quiz-question").textContent = question.question;
    const guesses = question.guesses;
    let idx = 0;
    guesses.forEach(guess => {
        document.getElementById(idx.toString()).setAttribute('class', 'quiz-answer');
        document.getElementById(`guess-${idx++}`).textContent = guess;
    })
    startTimer(totalTime);
}

function changequestion(){
    setTimeout(function() {
        if(currentQuestion >= quiz.size){
            return;
        }
        question = quiz.get(currentQuestion)
        loadquestion();
    }, 3000)
}

function resetquestion(){
    score = 0;
    currentQuestion = 0;
    question = quiz.get(currentQuestion);
}

function updateScore() {
    document.getElementById("user-score").innerHTML = `${score}/${quiz.size}`;
}

function startTimer(seconds) {
    const timerDisplay = document.getElementById("user-timer");
    let timeRemaining = seconds;
    timerDisplay.innerHTML = `${timeRemaining} seconds`;
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.innerHTML = `${timeRemaining} seconds`;

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                if (!isAnswered) {
                    verifyAnswer(-1, question.answer)
                    changequestion()
                }
            }
    }, 1000);
}

function quizSetter(src){
    document.getElementById("start-buttons").classList.add("hidden");
    document.getElementById("quiz-container").classList.remove("hidden");
    document.getElementById('go-back-button-wrapper').classList.remove("hidden");
    loadQuestionsPromise.then(() => {
        quiz = src;
        question = quiz.get(currentQuestion);
        loadquestion(); 
        document.getElementById("user-score").innerHTML = `${score}/${quiz.size}`;
        answers.addEventListener("click", handleUserChoice);
    });
    
}

document.addEventListener("DOMContentLoaded", () => {
    const htmlButton = document.getElementById("start-btn-html")
    const cssButton = document.getElementById("start-btn-css")
    const jsButton = document.getElementById("start-btn-js")

    htmlButton.addEventListener("click", () => {
        quizSetter(HTMLQUIZ)
    });
    cssButton.addEventListener("click", () => {
        quizSetter(CSSQUIZ)
    });
    jsButton.addEventListener("click", () => {
        quizSetter(JSQUIZ)
    });
});
document.getElementById("go-back-button-wrapper").addEventListener("click", () => {
    document.getElementById("start-buttons").classList.remove("hidden");
    document.getElementById("quiz-container").classList.add("hidden");
    document.getElementById('go-back-button-wrapper').classList.add("hidden");
    resetquestion();
});