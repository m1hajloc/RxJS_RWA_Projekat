import { interval,Subject,fromEvent,map,switchMap,takeUntil } from "rxjs";
const Url:string = "http://localhost:3000/questions/";
console.log(Url);

//const pitanja[5]:

const timer$ = interval(1000);
const time = document.querySelector('.timer');
timer$.pipe(map(id=>{
    return 10-id;
}))



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
      console.error('Error fetching questions:', error);
    });
}





// Assuming you have a question container with the class "question" in your HTML
const questionContainer = document.querySelector('.question');

// Function to display a question
function displayQuestion(question: any) {
  // Update the content of the existing question container
  questionContainer.textContent = question.pitanje;

  // Create answer buttons (assuming you have buttons with class "answer-button")
  const answerButtons = document.querySelectorAll('.answer-button');


 
    const answerText = question.pitanje; // Use the index directly to get the answer text
    
    answerButtons[0].textContent = question.a;
    answerButtons[1].textContent = question.b;
    answerButtons[2].textContent = question.c;
    answerButtons[3].textContent = question.d;
    // Add a click event listener to handle answer selection (we'll implement this next)
    for (let i = 0; i < 4; i++) 
    {
      const answerButton = answerButtons[i] as HTMLButtonElement;
      answerButton.addEventListener('click', () => handleAnswerClick(answerButton, question));
    }
}

// Function to handle user's answer click
function handleAnswerClick(answerButton: HTMLButtonElement, question: any) {
  // Check if the selected answer text matches the correct answer text
  console.log(answerButton.textContent)
  console.log(question.tacanodgovor)
  if (answerButton.textContent === question.tacanodgovor) {
    // Correct answer handling (you can customize this part)
    console.log('Correct answer!');
    answerButton.classList.add('correct');
  } else {
    // Wrong answer handling (you can customize this part)
    console.log('Wrong answer.');
    answerButton.classList.add('wrong');
  }

  // Disable all answer buttons to prevent further clicks
  const answerButtons = document.querySelectorAll('.answer-button');
  answerButtons.forEach(button => {
    (button as HTMLButtonElement).disabled = true;
  });

  // Wait for 2 seconds before moving to the next question
  setTimeout(() => {
    // Reset answer buttons and move to the next question
    answerButtons.forEach(button => {
      (button as HTMLButtonElement).classList.remove('correct', 'wrong');
      (button as HTMLButtonElement).disabled = false;
    });

    // Move to the next question (we'll implement this part next)
    moveToNextQuestion();
  }, 2000);
}
// Assuming you have an array of questions loaded from your JSON data
let pitanja: any[] = [];

// Define a variable to keep track of the current question index
let currentQuestionIndex = 0;

// Function to move to the next question
function moveToNextQuestion() {
  // Check if there are more questions to display
  if (currentQuestionIndex < pitanja.length - 1) {
    // Increment the current question index
    currentQuestionIndex++;

    startTimer();
    // Display the next question
    displayQuestion(pitanja[currentQuestionIndex]);
  } else {
    // If there are no more questions, you can handle the end of the quiz here
    // For example, show a "Quiz Finished" message or navigate to a results page
    console.log('Quiz Finished');
  }
}

fetchQuestions(Url).then(questions => {
  for (let i=0;i<5;i++)
  {
      pitanja[i] = questions[Math.round(Math.random()*12)]
  }
  

  displayQuestion(pitanja[0]); 
});
// Create a variable to store the timer subscription
let timerSubscription: any;

// Function to start or restart the timer
function startTimer() {
  // Clear any existing timer subscription
  if (timerSubscription) {
    timerSubscription.unsubscribe();
  }

  // Start a new timer
  timerSubscription = timer$.pipe(map(id => 10 - id)).subscribe(id => {
    if (id > 0) {
      time.innerHTML = id.toString();
    } else {
      time.innerHTML = "0";
    }
  });
}