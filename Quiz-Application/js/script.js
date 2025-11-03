/* --------------------------------------------------------------
     GLOBAL VARIABLES
  -------------------------------------------------------------- */
const elements = {
  // Select Role Screen
  teacher: document.querySelector('.teacher'),
  student: document.querySelector('.student'),
  admin: document.querySelector('.admin'),

  // SignUp Login Navigate Screen
  clickTosignup: document.querySelector('.clickTosignup'),
  clickToLogin: document.querySelector('.clickToLogin'),


  infoBox: document.querySelector('.info_box'),
  quizBox: document.querySelector('.quiz_box'),
  resultBox: document.querySelector('.result_box'),
  adminScreen: document.querySelector('.admin_screen'),
  continueBtn: document.querySelector('.info_box .restart'),
  nextBtn: document.querySelector('footer .next_btn'),
  optionList: document.querySelector('.option_list'),
  queText: document.querySelector('.que_text'),
  timerSec: document.querySelector('.timer_sec'),
  timeLeftTxt: document.querySelector('.time_left_txt'),
  timeLine: document.querySelector('.time_line'),
  bottomCounter: document.querySelector('footer .total_que'),
  infoSeconds: document.getElementById('infoSeconds'),
  Signup: document.querySelector('.Signup'),
  Login: document.querySelector('.Login'),
};

/* --------------------------------------------------------------
   ROLE BUTTONS
-------------------------------------------------------------- */

elements.teacher.addEventListener('click', () => {
  console.log("Click")
});
elements.student.addEventListener('click', () => {
  console.log("Click")
});
elements.admin.addEventListener('click', () => {
  console.log("Click")
});


/* --------------------------------------------------------------
   AUTh SETTINGS
-------------------------------------------------------------- */

elements.clickToLogin.addEventListener('click', () => {
  console.log("Login Date");
  elements.Signup.classList.remove('active-signup');
  elements.Login.classList.add('active-login')
})

elements.clickTosignup.addEventListener('click', () => {
  console.log("signup Date");
  elements.Login.classList.remove('active-login')
  elements.Signup.classList.add('active-signup')
});

// signup   
document.getElementById('signup').addEventListener('submit', e => {
  e.preventDefault()
  let signupName = document.getElementById('teacherEmailNameSignup').value;
  let signupEmail = document.getElementById('teacherEmailSignup').value;
  let signupPassword = document.getElementById('teacherPasswordSignup').value;
  let signupBatch = document.getElementById('batch').value;
  let signupTrainer = document.getElementById('trainer').value;


  const signup = {
    signupName,
    signupEmail,
    signupPassword,
    signupBatch,
    signupTrainer
  }

  console.log(signup);

  elements.Signup.classList.remove('active-signup')
  elements.adminScreen.classList.add('active-admin')

});

// login   
document.getElementById('login').addEventListener('submit', e => {
  e.preventDefault()
  const loginEmail = document.getElementById("teacherEmailLogin").value;
  const loginPasswoord = document.getElementById("teacherPasswordLogin").value;

  const loginObject = {
    loginEmail,
    loginPasswoord
  }

  console.log(loginObject);

  elements.Login.classList.remove('active-login')
  elements.adminScreen.classList.add('active-admin')
});

// -########################################################################## QUIZ START DATA

let quizData = null;          // {name, questions[], duration, maxQuestions}
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter, counterLine;
let lineWidth = 0;

/* --------------------------------------------------------------
   ADMIN → QUIZ SETUP
-------------------------------------------------------------- */
document.getElementById('adminForm').addEventListener('submit', e => {
  e.preventDefault();

  const course = document.getElementById('courseName').value.trim().toLowerCase();
  const teacherName = document.getElementById('teacherName').value;
  const duration = parseInt(document.getElementById('quizDuration').value, 10);
  const maxQ = parseInt(document.getElementById('quizQuestion').value, 10);
  const NumberWord = document.getElementById('NumberWord').value;
  const courseObj = questions.find(q => q.name.toLowerCase() === course);

  if (!courseObj) { alert('Course not found!'); return; }
  switch (NumberWord) {
    case "@kig8324":
      console.log("Switch Quiz");      
      break;  
      default:
      alert("Wrong Password"); 
      return     
      break;
  }

  // ---- slice the required number of questions ----
  const selectedQuestions = courseObj.questions.slice(0, maxQ);

  quizData = {
    teacherName : teacherName,
    name: courseObj.name,
    questions: selectedQuestions,
    duration: duration,
    maxQuestions: maxQ
  };

  // update info‑box text
  elements.infoSeconds.textContent = duration;
  console.log(quizData);

  // hide admin, show info
  elements.adminScreen.classList.remove('active-admin');
  elements.adminScreen.classList.add('ty');  
  elements.infoBox.classList.add('activeInfo');
});

/* --------------------------------------------------------------
   INFO → QUIZ START
-------------------------------------------------------------- */
elements.continueBtn.addEventListener('click', () => {
  elements.infoBox.classList.remove('activeInfo');
  elements.quizBox.classList.add('activeQuiz');

  resetQuizState();
  showQuestion(0);
  queCounter(1);
  startTimer(quizData.duration);
  startTimerLine(0);
});

/* --------------------------------------------------------------
   NEXT BUTTON
-------------------------------------------------------------- */
elements.nextBtn.addEventListener('click', () => {
  if (que_count < quizData.questions.length - 1) {
    que_count++;
    que_numb++;
    showQuestion(que_count);
    queCounter(que_numb);
    resetTimer();
    startTimer(quizData.duration);
    startTimerLine(0);
  } else {
    clearInterval(counter);
    clearInterval(counterLine);
    showResult();
  }
});

/* --------------------------------------------------------------
   RESTART / QUIT RESULT
-------------------------------------------------------------- */
document.querySelector('.result_box .restart').addEventListener('click', () => {
  elements.resultBox.classList.remove('activeResult');
  elements.quizBox.classList.add('activeQuiz');

  resetQuizState();
  showQuestion(0);
  queCounter(1);
  startTimer(quizData.duration);
  startTimerLine(0);
});

document.querySelector('.result_box .quit').addEventListener('click', () => location.reload());
document.querySelector('.quit').addEventListener('click', () => location.reload());

/* --------------------------------------------------------------
   CORE FUNCTIONS
-------------------------------------------------------------- */
function resetQuizState() {
  que_count = 0;
  que_numb = 1;
  userScore = 0;
  lineWidth = 0;
  elements.nextBtn.classList.remove('show');
}

function resetTimer() {
  clearInterval(counter);
  clearInterval(counterLine);
  elements.timeLeftTxt.textContent = 'Time Left';
  elements.timerSec.textContent = pad(quizData.duration);
}


//   show
function showQuestion(idx) {
  elements.optionList.innerHTML = "";
  const q = quizData.questions[idx];
  elements.queText.textContent = `${q.numb}. ${q.question}`;
  q.options.forEach(optionListX => {
    // elements.optionList.innerHTML +=  `<div class="option"  onclick="optionSelected(this)"><span>${(optionListX)}</span></div>`


    const div = document.createElement("div");
    div.classList.add("option");
    div.onclick = function () { optionSelected(this); };

    const span = document.createElement("span");
    span.textContent = optionListX; // ← This shows tags as plain text

    div.appendChild(span);
    elements.optionList.appendChild(div);


  });
}


// -########################################################################## QUIZ COUNTER
function queCounter(num) {
  elements.bottomCounter.innerHTML =
    `<span><p>${num}</p> of <p>${quizData.questions.length}</p> Questions</span>`;
}

// -########################################################################## QUIZ AUTO SELECT OPTION 
function optionSelected(el) {
  clearInterval(counter);
  clearInterval(counterLine);

  const userAns = el.textContent.trim();
  const correct = quizData.questions[que_count].answer;

  const all = elements.optionList.children;

  if (userAns === correct) {
    userScore++;
    el.classList.add('correct');
    el.insertAdjacentHTML('beforeend', '<div class="icon tick"><i class="fas fa-check"></i></div>');
  } else {
    el.classList.add('incorrect');
    el.insertAdjacentHTML('beforeend', '<div class="icon cross"><i class="fas fa-times"></i></div>');

    // highlight correct one
    for (let i = 0; i < all.length; i++) {
      if (all[i].textContent.trim() === correct) {
        all[i].classList.add('correct');
        all[i].insertAdjacentHTML('beforeend', '<div class="icon tick"><i class="fas fa-check"></i></div>');
      }
    }
  }

  // disable all
  for (let i = 0; i < all.length; i++) all[i].classList.add('disabled');

  elements.nextBtn.classList.add('show');
}

// -########################################################################## TIMER COUNTER
function startTimer(time) {
  elements.timerSec.textContent = pad(time);
  counter = setInterval(() => {
    time--;
    elements.timerSec.textContent = pad(time);
    if (time < 0) {
      clearInterval(counter);
      elements.timeLeftTxt.textContent = 'Time Off';
      autoSelectCorrect();
      elements.nextBtn.classList.add('show');
    }
  }, 1000);
}

// -########################################################################## QUIZ TIME LINE WIDTH

function startTimerLine(start) {
  const maxWidth = elements.time_line.parentElement.clientWidth; // full bar width
  const perSec = maxWidth / quizData.duration;

  lineWidth = start;
  counterLine = setInterval(() => {
    lineWidth += perSec;
    elements.time_line.style.width = lineWidth + 'px';
    if (lineWidth >= maxWidth) clearInterval(counterLine);
  }, 1000);
}

function autoSelectCorrect() {
  const correct = quizData.questions[que_count].answer;
  const all = elements.optionList.children;
  for (let i = 0; i < all.length; i++) {
    if (all[i].textContent.trim() === correct) {
      all[i].classList.add('correct');
      all[i].insertAdjacentHTML('beforeend', '<div class="icon tick"><i class="fas fa-check"></i></div>');
    }
    all[i].classList.add('disabled');
  }
}


// -########################################################################## RESULT QUIZ
function showResult() {
  elements.quizBox.classList.remove('activeQuiz');
  elements.resultBox.classList.add('activeResult');

  const scoreEl = elements.resultBox.querySelector('.score_text');
  let msg = '';
  if (userScore >= quizData.questions.length * 0.80) {
    msg = `Excellent! You got <p>${userScore}</p> out of <p>${quizData.questions.length}</p>`;
  } else if (userScore >= quizData.questions.length * 0.6) {
    msg = `Good, you got <p>${userScore}</p> out of <p>${quizData.questions.length}</p>`;
  } else {
    msg = `Keep practicing! You got <p>${userScore}</p> out of <p>${quizData.questions.length}</p>`;
  }
  scoreEl.innerHTML = `<span>${msg}</span>`;
}

function pad(n) { return n < 10 ? '0' + n : n; }


