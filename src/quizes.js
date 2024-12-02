class Question{
    question = "";
    guesses = new Map();
    answer = 0;
    constructor(question, guesses, answer){
        this.question = question;
        this.guesses = guesses;
        this.answer = answer;
    }

    get answer(){
        return this.answer;
    }
    get guesses(){
        return this.guesses;
    }
    get question(){
        return this.question;
    }
}


export const htmlQuiz = new Map();

htmlQuiz.set(0, new Question(
    "What is full form of HTML?", new Map([
        [0, "Hyper  thermal Maximum Language"],
        [1, "Hypertext Mathematic Language"],
        [2, "Hypertext Markup Language"],
        [3, "None Of these"]
    ]),
    2
));

htmlQuiz.set(1, new Question("Who invented HTML", new Map([
    [0, "Bill Gates"],
    [1, "Steve Jobs"],
    [2, "Mark Zuckerberg"],
    [3, "Tim Berners Lee"]
    ]), 
    3
));