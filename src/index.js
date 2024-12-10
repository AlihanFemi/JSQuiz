import { HTMLQUIZ, CSSQUIZ, JSQUIZ, loadQuestionsPromise } from "./quizes.js"; // Import the promise

let quiz = new Map();
let currentQuestion = 0;
let question;
let score = 0;
const answers = document.getElementById("quiz-answer-wrapper");
let timerInterval;
const totalTime = 2;


// Wait for the question data to be loaded

function revealAnswer(selected){
    
}

let isAnswered = false;
let answeredCorrectly = false;
function handleUserChoice(evt) {
    if (isAnswered) return;

    const target = evt.target.closest(".quiz-answer");
    if (target && target.classList.contains("quiz-answer")) {
        const buttonID = parseInt(target.id); 
        if (buttonID == question.answer) {
            target.classList.add('selected-correctly');
            currentQuestion++;
            score++;
            answeredCorrectly = true;
        } else {
            target.classList.add('selected');
            document.getElementById(question.answer).classList.add('correct'); 
        }

        for (let i = 0; i <= 3; i++) {
            if (i !== buttonID && i != question.answer) {
                document.getElementById(i).classList.add('wrong');
            }
        }

        // Reload after a delay
        clearInterval(timerInterval);
        updateScore();
        isAnswered = true;
        
        if(answeredCorrectly){
            changequestion();
        }
        else{
            setTimeout(function() {
                location.reload();
            }, 3000);
        }
        
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
    timerDisplay.innerHTML = timeRemaining;

    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.innerHTML = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            if (!isAnswered) {
                // Handle timeout (e.g., highlight correct answer and reload)
                document.getElementById(question.answer).classList.add('correct');
                for (let i = 0; i <= 3; i++) {
                    if (i != question.answer) {
                        document.getElementById(i).classList.add('wrong');
                        isAnswered = true;
                    }
                }
                
                currentQuestion++;
                setTimeout(() => changequestion(), 3000);
            }
        }
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    const htmlButton = document.getElementById("start-btn-html")
    const startButtonContainer = document.getElementById("start-buttons");
    const questionContainer = document.getElementById("quiz-container");

    htmlButton.addEventListener("click", () => {
        startButtonContainer.classList.add("hidden");
        questionContainer.classList.remove("hidden");
        document.getElementById('go-back-button-wrapper').classList.remove("hidden");
        loadQuestionsPromise.then(() => {
            quiz = HTMLQUIZ;
            question = quiz.get(currentQuestion);
            loadquestion(); 
            document.getElementById("user-score").innerHTML = `${score}/${quiz.size}`;
            answers.addEventListener("click", handleUserChoice);
        });
    });

});
document.getElementById("go-back-button-wrapper").addEventListener("click", () => {
    const startButtonContainer = document.getElementById("start-buttons");
    const questionContainer = document.getElementById("quiz-container");
    startButtonContainer.classList.remove("hidden");
    resetquestion();
    questionContainer.classList.add("hidden");
    document.getElementById('go-back-button-wrapper').classList.add("hidden");
})