class Question{
    question = "";
    guesses = new Map();
    answer = 0;
    constructor(question, guesses, answer){
        this.question = question;
        this.guesses = guesses;
        this.answer = answer;
    }
}

const PATH = '/get/questions';
export const HTMLQUIZ = new Map();
export const CSSQUIZ = new Map();
export const JSQUIZ = new Map();

async function loadQuestions() {
    try {
        const response = await fetch(PATH); // Replace with your file path
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const text = await response.text(); // Read file contents as text
        parseQuestions(text); // Parse and use the questions
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

function answersAsMap(answers){
    let map = new Map();
    let id = 0;
    answers.forEach(answer => {
        map.set(id++, answer);
    });
    return map;
}

function keyByValue(map, KeyValue) {
    let result;
    map.forEach((value, key) => {
        result = value === KeyValue ? key : result;
    });
    return result;
}

function loadQuestionsIntoMap(map, questions) {
    let id = 0;
    questions.forEach(question => {
        const guessMap = answersAsMap(question.Answers)
        map.set(id++, new Question(question.Question, guessMap, keyByValue(guessMap, question.CorrectAnswer)))
    });
}

function parseQuestions(text) {
    const data = JSON.parse(text);

    loadQuestionsIntoMap(HTMLQUIZ, data.HTML);
    loadQuestionsIntoMap(CSSQUIZ, data.CSS);
    loadQuestionsIntoMap(JSQUIZ, data.JavaScript);
};

async function getQuestions(){
    await loadQuestions();
    return true;
}
export let loadQuestionsPromise = getQuestions(); 