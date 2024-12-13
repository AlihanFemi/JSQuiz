import { HTMLQUIZ, CSSQUIZ, JSQUIZ, loadQuestionsPromise } from "./quizes.js";

let quiz = new Map();
let players = new Map();
let currentQuestion = 0;
let currentPlayer = 0;
let question;
let playerCount = null;
let isAnswered = false;
const answers = document.getElementById("quiz-answer-wrapper");
let timerInterval;
const totalTime = 3;
let chosenQuiz = "";

function verifyAnswer(selected, answer){
    for(let i = 0; i <= 3; i++){
        if(i === selected && selected === answer){
            players.set(currentPlayer, (players.get(currentPlayer))+1);
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
    currentQuestion++;
    currentPlayer++;
    isAnswered = true;
}

function handleUserChoice(evt) {
    if (isAnswered) return;

    const target = evt.target.closest(".quiz-answer");
    if (target && target.classList.contains("quiz-answer")) {
        const buttonID = parseInt(target.id); 
        verifyAnswer(buttonID, question.answer)
        clearInterval(timerInterval);
        changequestion();
    }
};

function updateBoard(playerID){
    document.getElementById(`quiz-container`).classList.add(`p-${playerID}`);
}

function loadquestion(){
    updateBoard(currentPlayer);
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

function showEndScreen(){
    document.getElementById('endgame-screen').classList.remove("hidden");
    document.getElementById('quiz-container').classList.add("hidden");
    players.forEach((value, key) => {
        document.getElementById(`score-${key}`).classList.remove("hidden");
        document.getElementById(`score-${key}`).textContent = `Player ${key + 1}: ${value}`;
    });
}

function changequestion(){
    setTimeout(function() {
        if(currentPlayer >= playerCount){
            currentPlayer = 0;
        }
        if(currentQuestion >= quiz.size){
            showEndScreen();
            return;
        }
        question = quiz.get(currentQuestion)
        loadquestion();
    }, 3000)
}

function resetquestion(){
    currentQuestion = 0;
    currentPlayer = 0;
    chosenQuiz = "";
    playerCount = null;
    players = new Map();
    question = quiz.get(currentQuestion);
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
    document.getElementById("player-buttons").classList.add("hidden");
    document.getElementById("quiz-container").classList.remove("hidden");
    document.getElementById('go-back-button-wrapper').classList.remove("hidden");
    loadQuestionsPromise.then(() => {
        quiz = src;
        question = quiz.get(currentQuestion);
        currentPlayer = 0;
        loadquestion(); 
        answers.addEventListener("click", handleUserChoice);
    });
    
}

function getPlayerCount(evt){
    const target = evt.target.closest(".player-button");
    let targetIDArray = target.id.split('-');
    playerCount = parseInt(targetIDArray[1]);
    for(let i = 0; i < playerCount; i++){
        players.set(i, 0);
    }
    if(chosenQuiz === "HTML"){
        quizSetter(HTMLQUIZ);
    }
    else if(chosenQuiz === "CSS"){
        quizSetter(CSSQUIZ);
    }
    else if(chosenQuiz === "JS"){
        quizSetter(JSQUIZ);
    }
}   

function setPlayerCount(){
    document.getElementById("start-buttons").classList.add("hidden");
    document.getElementById("player-buttons").classList.remove("hidden");
    const count = document.getElementById("player-buttons");
    count.addEventListener("click", getPlayerCount);
}

document.addEventListener("DOMContentLoaded", () => {
    const htmlButton = document.getElementById("start-btn-html")
    const cssButton = document.getElementById("start-btn-css")
    const jsButton = document.getElementById("start-btn-js")

    htmlButton.addEventListener("click", () => {
        chosenQuiz = "HTML";
        setPlayerCount();
    });
    cssButton.addEventListener("click", () => {
        chosenQuiz = "CSS";
        setPlayerCount();
    });
    jsButton.addEventListener("click", () => {
        chosenQuiz = "JS";
        setPlayerCount();
    });
});
document.getElementById("go-back-button-wrapper").addEventListener("click", () => {
    document.getElementById("start-buttons").classList.remove("hidden");
    document.getElementById("quiz-container").classList.add("hidden");
    document.getElementById('go-back-button-wrapper').classList.add("hidden");
    document.getElementById('endgame-screen').classList.add("hidden");
    resetquestion();
});