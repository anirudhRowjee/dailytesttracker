console.log("Hello World!");

// get local database in database.js file
var database = database;


var testparent = document.getElementById('test-parent');
var answerparent = document.getElementById('answer-parent');
var startparent = document.getElementById('start-parent');
var titlebar = document.getElementById('titlebar');


// modules
class MarkingScheme {

    constructor(name, correct, wrong, na){
        this.name = name;
        this.correct = correct;
        this.wrong = wrong;
        this.na = na;
    }
}

class Evaluator{
    
    constructor(correctstring, submittedstring, test){
        this.correctstring = correctstring;
        this.submittedstring = submittedstring;
        this.markscheme = test.markingScheme;
        this.test = test;
    }

    evaluate(){
        var total = 0;
        // split both strings
        var correctlist = this.correctstring.split(" ");
        var submittedlist = this.submittedstring.split(" ");
        // split inner terms for each
        for(var i=0; i < this.test.n_questions; i++){
            correctlist[i] = correctlist[i].split('-');
            submittedlist[i] = submittedlist[i].split('-');
        }
        console.log(correctlist);
        console.log(submittedlist);
        for(var i = 0; i < test.questions.length; i++){
            var correct = correctlist[i];
            var submitted = submittedlist[i];
            if(submitted[0] == 'X'){
                total += this.markscheme.na;
            }
            else if(correct[0] == submitted[0]){
                if(correct[1].toLowerCase() == submitted[1].toLowerCase()){
                    total += this.markscheme.correct;
                }
                else{
                    total += this.markscheme.wrong;
                }
            }
        }
        return total;
    }
}

class Question{

    constructor(number){
        this.number = number;
        this.options = ['A', 'B', 'C', 'D'];
        this.selected = 'X';
        this.markedforeval = false;
    }
}


class Test {
    
    constructor(name, date, time_alotted, n_questions, markingScheme){
        this.name = name;
        this.date = date;
        this.time_alotted = time_alotted;
        this.n_questions = n_questions;
        this.markingScheme = markingScheme;
        this.correctAnswerString = "";
        this.submittedAnswerString = "";
        this.time_finished = 0;
        this.questions = []; // populated with Question objects
        this.totalScore = this.markingScheme.correct * this.n_questions;
        this.finalScore = 0;
        this.done = false;
        this.currentquestion = 1;
    }

    get score(){
        return `${this.finalScore}/${this.totalScore}`;
    }

    get all_questions(){
        return self.questions;
    }

    setQuestions(){
        // clear list of questions
        var list_div = document.getElementById('QuestionList');
        list_div.innerHTML = "";
        // generates blank questions
        for(var i = 0; i < this.n_questions; i++){
            this.questions.push(new Question(i + 1));
            var qno = i+1;
            var button_template = `<button id='qb${qno}' onclick='setQuestion(${qno}, test);' class='btn grid-item question_jumpbutton'>${qno}</button>`
            // populates questionList for jumping to questions and answer statuh
            list_div.innerHTML += button_template;
        }
    }

    getQuestion(question_number){
        if(question_number < 1){
            console.log(" Index Error! ");
        }
        else{
            return this.questions[question_number-1]
        }
    }

    getAnswerString(){
        var finalanswerstring = "";
        for(var i=1; i < this.n_questions+1 ;i++){
            var question = this.getQuestion(i);
            finalanswerstring += `${question.number}-${question.selected} `;
        }
        console.log(finalanswerstring.trim() );
        return finalanswerstring.trim();
    }

    evaluate(){
        this.done = true;
        // eval function, calculates this.finalScore
        console.log("Evaluator begins");

        var submittedanswerstring = this.getAnswerString();
        this.submittedAnswerString = submittedanswerstring;
        console.log(this.submittedAnswerString);

        var correctanswerstring = prompt("Please Enter Answer String");
        this.correctAnswerString = correctanswerstring;
        console.log('correct answer string ', correctanswerstring);

        var evaluator = new Evaluator(correctanswerstring, this.submittedAnswerString, this);
        var score = evaluator.evaluate();

        this.finalScore = score;

    }

    startTest(){
        setQuestion(1,this);
        StartTimer(this.time_alotted * 60);
    }

    endTest(){
        setQuestion(1,this);
        this.evaluate();
        testparent.hidden = true;
        titlebar.hidden = true;
        answerparent.hidden = false;
        var marks = document.getElementById('finalScore').innerHTML = this.score;

    }
}

// functions

var options = [document.getElementById('A'), document.getElementById('B'), document.getElementById('C'), document.getElementById('D')];
const classic_markingschemes = [new MarkingScheme("JEE Mains", 4, -1, 0), new MarkingScheme("KCET", 1,0,0)]; // JEE and KCET

// countdowntimer from https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
function CountDownTimer(duration, granularity) {
  this.duration = duration;
  this.granularity = granularity || 1000;
  this.tickFtns = [];
  this.running = false;
}

CountDownTimer.prototype.start = function() {
  if (this.running) {
    return;
  }
  this.running = true;
  var start = Date.now(),
      that = this,
      diff, obj;

  (function timer() {
    diff = that.duration - (((Date.now() - start) / 1000) | 0);
    
    if (diff > 0) {
      setTimeout(timer, that.granularity);
    } else {
      diff = 0;
      that.running = false;
    }

    obj = CountDownTimer.parse(diff);
    that.tickFtns.forEach(function(ftn) {
      ftn.call(this, obj.minutes, obj.seconds);
    }, that);
  }());
};

CountDownTimer.prototype.onTick = function(ftn) {
  if (typeof ftn === 'function') {
    this.tickFtns.push(ftn);
  }
  return this;
};

CountDownTimer.prototype.expired = function() {
  return !this.running;
};

CountDownTimer.parse = function(seconds) {
  return {
    'minutes': (seconds / 60) | 0,
    'seconds': (seconds % 60) | 0,
  };
};

function StartTimer(duration){
    function format(display) {
        return function (minutes, seconds) {
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.textContent = minutes + ':' + seconds;
            elapsed_string = minutes + ":" + seconds;
        };
    }
    function elapsed(){
        if(this.expired()){
            if(test.done == true){
                return
            }
            var answer = alert("Time Has Elapsed! test will be submitted for evaulation.");
            this.running = false;
            test.endTest();
            return
        }
        else if(test.done == true){
            console.log(" initiate manual timer shutoff ");
            this.running = false;
            return
        }
    }
    var timer = new CountDownTimer(duration);
    var b = "c";
    var timerElement = document.getElementById('timer');
    timer.onTick(format(timerElement)).onTick(elapsed).start();
}


function reflectQuestionStatusChange(question){
    console.log(` reflecting status change for question ${question} `);
    var button = document.getElementById(`qb${question.number}`)
    if(question.markedforeval == true){
        button.style.backgroundColor = '#6633cc';
    }
    else if(question.markedforeval == false){
        if(question.selected == 'X'){
            button.style.backgroundColor = 'lightgrey';
        }
        else{
            button.style.backgroundColor = 'green';
        }
    }
}

function clearChoices(){
    document.getElementById('A').checked = false;
    document.getElementById('B').checked = false;
    document.getElementById('C').checked = false;
    document.getElementById('D').checked = false;
    console.log("All radio boxes have been unselected");
}

function getCheckedAnswer(){
    // will return value of whichever radio button is checked
    console.log(" seeing which radio box is ticked ..")
    for(var i = 0; i < 4; i++){
        if(options[i].checked == true){
            console.log(options[i].value + " checked");
            return options[i].value;
        }
    }
    return null;
}

function markForEval(question, test){
    var state = test.getQuestion(question).markedforeval;
    console.log(`marking question ${question} for evaluation`);
    question_object = test.getQuestion(question);
    if(state == true){
        question_object.markedforeval = false;
        reflectQuestionStatusChange(question_object) ;
    }
    else if(state == false){
        question_object.markedforeval = true;
        reflectQuestionStatusChange(question_object) ;
    }
}


function setQuestion(question_no, test){

    if(question_no == 1){
        document.getElementById('NextQ').disabled = false;
        document.getElementById('PrevQ').disabled = true;
    }
    else if(question_no == test.n_questions){
        document.getElementById('NextQ').disabled = true;
        document.getElementById('PrevQ').disabled = false;
    }
    else{
        document.getElementById('NextQ').disabled = false;
        document.getElementById('PrevQ').disabled = false;
    }
    // save current question state
    var current_question = document.getElementById('questionNumber').innerHTML;
    console.log(current_question);
    if(current_question == '#'){
        // program has just initialized, so don't register any answer
        current_question = 1;
        document.getElementById('questionNumber').innerHTML = question_no;
        clearChoices();
    }
    else{
        var current_answer = getCheckedAnswer();
        console.log(current_question);
        console.log(current_answer);
        // check for current answer being null; if not, save it as choice for
        // current question.
        var current_question_object = test.getQuestion(current_question);
        console.log(current_question_object);
        if(current_answer == null){
            console.log(`no choice selected for question ${current_question}, so skipping`);
            current_question_object.selected = "X";
            reflectQuestionStatusChange(current_question_object);
        }
        else{
            // set 'selected' of current question to selected radio button
            current_question_object.selected = current_answer;
            reflectQuestionStatusChange(current_question_object);
            clearChoices();
        }

        // reflect change in question by setting question number to new number
        document.getElementById('questionNumber').innerHTML = question_no;
        test.currentquestion = question_no;

        // get question to change to
        question_object = test.getQuestion(question_no);


        // set options of question
        if(question_object.selected == "X"){
            console.log("nothing selected");
        }
        else{
            // now that selected value of question is there, set it to option stored
            document.getElementById(question_object.selected).checked = true; 
        }
    }
    console.log(JSON.stringify(test.questions));
}



function nextQuestion(q,test){
    // set question selected
    setQuestion(q+1, test);
    console.log("currently question", test.currentquestion); 
}

function previousQuestion(q,test){
    setQuestion(q-1, test);
    console.log("currently question", test.currentquestion); 
}

function startTest(test){
    titlebar.hidden = false;
    testparent.hidden = false;
    answerparent.hidden = true;
    startparent.hidden = true;
    // populate questions
    test.setQuestions();
    console.table(JSON.stringify(test.questions));
    setQuestion(1, test);
    test.startTest();
}

function getMarkingSchemeByName(name){
    for(var i = 0; i < classic_markingschemes.length; i++){
        if(classic_markingschemes[i].name == name){
            return classic_markingschemes[i];
        }
    }
}

function SetupTest(){
    const today_date = new Date().toISOString().slice(0, 10);
    var testname = document.getElementById('testName').value;
    var testtime = Number(document.getElementById('testTime').value);
    var nquestions = Number(document.getElementById('testNumberOfQuestions').value);
    var markingschemename = document.getElementById('testMarkingScheme');
    markingschemename = markingschemename.options[markingschemename.selectedIndex].value;
    var date = today_date;
    var ms_object = getMarkingSchemeByName(markingschemename);

    test = new Test( testname, date, testtime, nquestions, ms_object );
    console.log("New test - ", test);

    test.done = false;
    var currentQuestion = 1; // critical variable declaration

    document.getElementById('NextQ').onclick = function(){nextQuestion(test.currentquestion, test);}     ;
    document.getElementById('PrevQ').onclick = function(){previousQuestion(test.currentquestion, test);} ;
    document.getElementById('MarkForEval').onclick = function(){markForEval(test.currentquestion, test);};
    document.getElementById('SubmitTest').onclick = function(){test.endTest();};

    //start the test
    startTest(test);

}


function initialize(){
    // get test starting information
    answerparent.hidden = true;
    testparent.hidden = true;
    titlebar.hidden = true;
    startparent.hidden = false;

    //set dropdown choice values
    var dropdown = document.getElementById('testMarkingScheme');
    dropdown.innerHTML = "";
    for(var i = 0; i < classic_markingschemes.length; i++){
        dropdown.innerHTML += `<option value="${classic_markingschemes[i].name}"> ${classic_markingschemes[i].name} </option>`;
    }
    document.getElementById('StartTestButton').onclick = function(){ SetupTest(); };
}

initialize();
