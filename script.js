let welcomePage = document.getElementById("mainPage")// a variable for first page
let correctResponse = document.getElementById("correctResponse");
let wrongAnswer = document.getElementById('wrongAnswer');
var secondsLeft = 100;// a variable for start time
let timer = document.getElementById("timer");//the element that displays the time
let scoresDiv = document.getElementById("scores-div");//div for high scores
let buttonsDiv = document.getElementById("buttons")
let viewScoresBtn = document.getElementById("view-scores")//button for high scores
let startButton = document.getElementById("start-button");//start button div
startButton.addEventListener("click", setTime);
let messages = document.getElementById("instructions")
var questionDiv = document.getElementById("question-div");// variable for the questions title
let results = document.getElementById("results");// div to hold the results
let gameOver = document.getElementById("game-over");
var choices = document.getElementById("choices");// div for the choices
let emptyArray = [];// an array to store high scores
let storedArray = JSON.parse(window.localStorage.getItem("highScores"));// the array of high scores from local storage
var questionCount = 0;// keeping track of which question we're on
let score = 0//keeping score
gameOver.hidden = true;

//Timer starts when the user clicks startButton (see above).
function setTime() {
  displayQuestions();
  let timerInterval = setInterval(function() {
    secondsLeft--;
    timer.textContent = "";
    timer.textContent = "Time: " + secondsLeft;
    if (secondsLeft <= 0 || questionCount === questions.length) {
      clearInterval(timerInterval);
      captureUserScore();
    } 
  }, 1000);

 instructions.remove();
 
}

//function to load the questions on the page
function displayQuestions() {

  removeEls(startButton);

  if (questionCount < questions.length) {
    questionDiv.innerHTML = questions[questionCount].title;
    choices.textContent = "";

    for (let i = 0; i < questions[questionCount].multiChoice.length; i++) {
      let el = document.createElement("button");
      el.innerText = questions[questionCount].multiChoice[i];
      el.setAttribute("data-id", i);
      el.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (el.innerText === questions[questionCount].answer) {
          // Display the correct Answer to user
          correctResponse.textContent = "Correct!"
          // if(answer === answer) {
          //   correctResponse.attributes('style, color: green')
          // }else{
          //   correctResponse.attributes('style, color: red')
          // }
          // console.log(correctResponse)
          score += secondsLeft;
    
        } else {
          correctResponse.textContent = "Wrong!";
          wrongAnswer.textContent = "Wrong!";
          console.log(wrongAnswer)
          score -= 10;
          secondsLeft = secondsLeft - 10;
        }
        
        questionDiv.innerHTML = "";

        if (questionCount === questions.length) {
          return;
        } else {
          questionCount++;
          displayQuestions();
        }
      });
      choices.append(el);
    }
    
  }
  
}

function captureUserScore() {
  timer.remove();
  gameOver.hidden =false;
   correctResponse.hidden=true;
  // wrongAnswer.hidden=true;
  choices.textContent = "";

  let initialsInput = document.createElement("input");
  let postScoreBtn = document.createElement("input");

  gameOver.innerHTML = "Game Over!!!";

  results.innerHTML = `You scored ${score} points! Enter name: `;
  initialsInput.setAttribute("type", "text");
  postScoreBtn.setAttribute("type", "button");
  postScoreBtn.setAttribute("value", "Post My Score!");

  postScoreBtn.addEventListener("click", function (event) {
    event.preventDefault();
    let scoresArray = defineScoresArray(storedArray, emptyArray);

    let initials = initialsInput.value;
    let userAndScore = {
      initials: initials,
      score: score,
    };

    scoresArray.push(userAndScore);
    saveScores(scoresArray);
    displayAllScores();
    clearScoresBtn();
    goBackBtn();
    viewScoresBtn.remove();
  });
  results.append(initialsInput);
  results.append(postScoreBtn);
}

const saveScores = (array) => {
  window.localStorage.setItem("highScores", JSON.stringify(array));
}

const defineScoresArray = (arr1, arr2) => {
  if(arr1 !== null) {
    return arr1
  } else {
    return arr2
  }
}

const removeEls = (...els) => {
  for (let el of els) el.remove();
}
//FUNCTION
function displayAllScores() {
  removeEls(timer, startButton, results, gameOver);
  let scoresArray = defineScoresArray(storedArray, emptyArray);

  scoresArray.forEach(obj => {
    let initials = obj.initials;
    let storedScore = obj.score;
    let resultsP = document.createElement("p");
    resultsP.innerText= `${initials}: ${storedScore}`;
    scoresDiv.append(resultsP);
  });
}
//FUNCTION
function viewScores() {
  viewScoresBtn.addEventListener("click", function(event) {
    event.preventDefault();
    removeEls(timer, startButton);
    displayAllScores();
    removeEls(viewScoresBtn);
    clearScoresBtn();
    goBackBtn();
    instructions.remove();
    
  });
}
//FUNCTION
function clearScoresBtn() {    
  let clearBtn = document.createElement("input");
  clearBtn.setAttribute("type", "button");
  clearBtn.setAttribute("value", "Clear Scores");
  clearBtn.addEventListener("click", function(event){
    event.preventDefault();
    removeEls(scoresDiv);
    window.localStorage.removeItem("highScores");
  })
  scoresDiv.append(clearBtn)
}
//FUNCTION
function goBackBtn() {
  let backBtn = document.createElement("input");
  backBtn.setAttribute("type", "button");
  backBtn.setAttribute("value", "Go Back");
  backBtn.addEventListener("click", function(event){
    event.preventDefault();
    window.location.reload();
  })
  buttonsDiv.append(backBtn)
}

viewScores();
