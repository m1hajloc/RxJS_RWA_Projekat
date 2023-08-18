import { interval,Subject,fromEvent,map,switchMap,takeUntil } from "rxjs";

const Url = "http://localhost:3000/questions/";
console.log(Url);

const timer$ = interval(1000);
const time = document.querySelector('.timer');
timer$.pipe(map(id=>{
    return 10-id;
}))

.subscribe(id=>{ if (id>0)
    time.innerHTML = id.toString();
    else
    time.innerHTML = "0";


})


const answerButtons = document.querySelectorAll('.answer-button');
const answerClick$ = new Subject();

answerButtons.forEach((button, index) => {
  fromEvent(button, 'click').subscribe(() => {
    answerClick$.next(index);
  });
});

const nextQuestion$ = answerClick$.pipe(
    switchMap(() => timer$), 
    takeUntil(answerClick$) 
  );
  
  nextQuestion$.subscribe((id) => {
    document.querySelector('.answer-button').innerHTML = "crvena";
  });