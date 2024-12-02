import { htmlQuiz } from "./quizes.js";

let currentQuiz = 0;
let  quiz = htmlQuiz.get(currentQuiz);
const answers = document.getElementById("quiz-answer-wrapper");
let timerInterval;
const totalTime = 30;

let isAnswered = false;
let answeredCorrectly = false;
function handleUserChoice(evt) {
    if (isAnswered) return;

    const target = evt.target.closest(".quiz-answer");
    if (target && target.classList.contains("quiz-answer")) {
        const buttonID = parseInt(evt.target.id); // Convert to number
        // Check if the clicked answer is correct
        if (buttonID === quiz.answer) {
            target.classList.add('correct');
            currentQuiz++;
            answeredCorrectly = true;
        } else {
            target.classList.add('selected');
            document.getElementById(quiz.answer).classList.add('correct'); // Highlight correct answer
        }

        // Highlight wrong answers (all except the correct and clicked ones)
        for (let i = 0; i <= 3; i++) {
            if (i !== buttonID && i !== quiz.answer) {
                document.getElementById(i).classList.add('wrong');
            }
        }

        // Reload after a delay
        clearInterval(timerInterval);
        isAnswered = true;
        
        if(answeredCorrectly){
            changeQuiz();
        }
        else{
            setTimeout(function() {
                location.reload();
            }, 3000);
        }
        
    }
};

function loadQuiz(){
    document.getElementById("quiz-question").innerHTML = quiz.question;
    const guesses = quiz.guesses;
    document.getElementById("guess-0").innerHTML = guesses.get(0);
    document.getElementById("guess-1").innerHTML = guesses.get(1);
    document.getElementById("guess-2").innerHTML = guesses.get(2);
    document.getElementById("guess-3").innerHTML = guesses.get(3);
    for (let i = 0; i <= 3; i++) {
        document.getElementById(i).setAttribute('class', 'quiz-answer');
    }

    startTimer(totalTime);
}

function changeQuiz(){
    setTimeout(function() {
        if(currentQuiz >= htmlQuiz.size){
            currentQuiz = 0;
        }
        quiz = htmlQuiz.get(currentQuiz)
        loadQuiz();
    }, 3000)
    isAnswered = false;
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
                document.getElementById(quiz.answer).classList.add('correct');
                for (let i = 0; i <= 3; i++) {
                    if (i !== quiz.answer) {
                        document.getElementById(i).classList.add('wrong');
                    }
                }
                
                currentQuiz++;
                setTimeout(() => changeQuiz(), 3000);
            }
        }
    }, 1000);
}

answers.addEventListener("click", handleUserChoice);


onload = (event) => {
    loadQuiz();
}