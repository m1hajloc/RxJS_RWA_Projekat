import { interval,Subject,fromEvent,map,switchMap,takeUntil } from "rxjs";
const Url:string = "http://localhost:3000/questions/";
console.log(Url);

//const pitanja[5]:

const timer$ = interval(1000);
const time = document.querySelector('.timer');
const questionContainer = document.querySelector('.question');
const answerButtons = document.querySelectorAll('.answer-button');
const progressBar:HTMLDivElement = document.querySelector('.progress-bar');
let pitanja: any[] = [];
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
      time.innerHTML = id.toString();
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
  for (let i = 0; i < 4; i++) 
  {
    const answerButton = answerButtons[i] as HTMLButtonElement;
    answerButton.addEventListener('click', () => handleAnswerClick(answerButton));
  }
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
    console.log('Correct answer!');
    answerButton.classList.add('correct');
  } else {
    console.log('Wrong answer.');
    answerButton.classList.add('wrong');
  }
  
  answerButtons.forEach(button => {
    (button as HTMLButtonElement).disabled = true;
  });

  if (timerSubscription) {
    timerSubscription.unsubscribe();
  }
  setTimeout(() => {
    answerButtons.forEach(button => {
      (button as HTMLButtonElement).classList.remove('correct', 'wrong');
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
    console.log('Quiz Finished');
  }
}

fetchQuestions(Url).then(questions => {
  for (let i=0;i<5;i++)
  {
      pitanja[i] = questions[Math.round(Math.random()*12)]
  }
  SetUpEventListenersToButtons();
  displayQuestion(pitanja[0]); 
});