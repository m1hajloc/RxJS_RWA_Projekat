import { interval,map } from "rxjs";
const Url:string = "http://localhost:3000/questions/";
console.log(Url);
import { Question } from './Interfaces/question';


const timer$ = interval(1000);
const time = document.querySelector('.timer');
const questionContainer = document.querySelector('.question');
const answerButtons = document.querySelectorAll('.answer-button');
const progressBar:HTMLDivElement = document.querySelector('.progress-bar');
const startButton : HTMLButtonElement = document.querySelector('.start-button');
const currentScoreElement = document.getElementById('current-score');
const highscoreElement = document.getElementById('highscore');
let pom:number = 0;
let score = 0;
let highscore = 0;
let pitanja: Question[] = [];
let currentQuestionIndex = 0;
let timerSubscription: any;



function fetchQuestions(url: string) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Greska prilikoom fatchovanja:', error);
    });
}

function startTimer() 
{
  time.innerHTML = "10";
  progressBar.style.width = `100%`;

  timerSubscription = timer$.pipe(map(id => 9 - id)).subscribe(id => {
    if (id >= 0) {
      time.innerHTML = (id+1).toString();
        const width = (id / 10) * 100;
        progressBar.style.width = `${width}%`;
    } else {
      time.innerHTML = "0"; 
  answerButtons.forEach(button => {
    (button as HTMLButtonElement).disabled = true;
    if(button.textContent === pitanja[currentQuestionIndex].tacanodgovor)
    {
      button.classList.add('correct-not-answered')
    }
  });
    
  if (timerSubscription) {
    timerSubscription.unsubscribe();
  }

  setTimeout(() => {
    answerButtons.forEach(button => {
      (button as HTMLButtonElement).classList.remove('correct-not-answered');
      (button as HTMLButtonElement).disabled = false;
    });
    moveToNextQuestion();
  }, 2000);

    }
  });
}


function SetUpEventListenersToButtons()
{
  if (pom==0){
  for (let i = 0; i < 4; i++) 
  {
    const answerButton = answerButtons[i] as HTMLButtonElement;
    answerButton.addEventListener('click', () => handleAnswerClick(answerButton));
  }
  }
  pom++;
}



function displayQuestion(question: any) 
  {
    startTimer();
    questionContainer.textContent = question.pitanje;
    answerButtons[0].textContent = question.a;
    answerButtons[1].textContent = question.b;
    answerButtons[2].textContent = question.c;
    answerButtons[3].textContent = question.d;
  }




function handleAnswerClick(answerButton: HTMLButtonElement) {
  console.log(answerButton.textContent)
  console.log(pitanja[currentQuestionIndex].tacanodgovor)
  if (answerButton.textContent === pitanja[currentQuestionIndex].tacanodgovor) {
    
    score+=parseInt(time.innerHTML);
    currentScoreElement.textContent = score.toString();
    answerButton.classList.add('correct');
  } else {
    
    score-=5;
    currentScoreElement.textContent = score.toString();
    answerButton.classList.add('wrong');
    answerButtons.forEach(button => {
      if(button.textContent === pitanja[currentQuestionIndex].tacanodgovor)
      {
        button.classList.add('correct-not-answered')
      }})
  }
  
  answerButtons.forEach(button => {
    (button as HTMLButtonElement).disabled = true;
  });

  if (timerSubscription) {
    timerSubscription.unsubscribe();
  }
  setTimeout(() => {
    answerButtons.forEach(button => {
      (button as HTMLButtonElement).classList.remove('correct','correct-not-answered', 'wrong');
      (button as HTMLButtonElement).disabled = false;
    });
    moveToNextQuestion();
  }, 2000);
}





function moveToNextQuestion() 
{
  
  if (currentQuestionIndex < pitanja.length - 1) {
    currentQuestionIndex++;
    displayQuestion(pitanja[currentQuestionIndex]);
  } else {
    if (highscore<score)
  {

    highscore=score
    highscoreElement.textContent = highscore.toString();
  }
    startButton.style.visibility = 'visible';
    alert("Your Score is: " + score + "\nIf you want to try again click button Play again!");
    answerButtons.forEach(button => {
      (button as HTMLButtonElement).disabled = true;})
  }
}



startButton.addEventListener('click', () => {
  score=0;
  currentQuestionIndex = 0;
  currentScoreElement.textContent = "0";
  answerButtons.forEach(button => {
  (button as HTMLButtonElement).disabled = false;})
  fetchQuestions(Url).then(questions => {
    for (let i=0;i<5;i++)
    {
        pitanja[i] = questions[Math.round(Math.random()*25)]
    }
    startButton.style.visibility = 'hidden';
    startButton.textContent = "Play Again";
    SetUpEventListenersToButtons();
    
    displayQuestion(pitanja[0]); 
  });
});