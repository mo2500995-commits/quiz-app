let questionsCount = document.querySelector(".howmany");
let submitFormBtn = document.querySelector(".submit-form");
let quizArea = document.querySelector(".quiz-app");
let questionsCountSelector = document.querySelector(".q-count span");

let spansHolder = document.querySelector(".bullets .spans ");
window.onload = function () {
  questionsCount.focus();
};

let score = 0;

// 1 selected type and numbers of questions
let questionValue = Number(questionsCount.value);

// form selected function
submitFormBtn.addEventListener("click", async (e) => {
  cur = 0;
  questionValue = Number(questionsCount.value);

  submitFormBtn.parentElement.style.display = "none";

  let questionType = document.querySelector("select option:checked").value;

  // creatBullets(questionValue);

  quizArea.style.display = "block";
  const questions = await getQuestions(questionType, questionValue);

  if (!questions) {
    quizArea.style.display = "none";
    submitFormBtn.parentElement.style.display = "block";
    questionsCount.focus();
    return;
  }

  AddQuestions(finalQuestion, 0);
  // corected(finalQuestion, 0);
  questionsCountSelector.innerHTML = `${1} من ${questionValue} `;
  let categoryName = document.querySelector(".category span");

  categoryName.textContent = document.querySelector(
    "select option:checked",
  ).dataset.name;

  setTomes();
});

let finalQuestion = [];

async function getQuestions(qtype, questionValue) {
  let res = await fetch(qtype);
  let data = await res.json();
  if (questionValue <= 0) {
    Swal.fire({
      icon: "warning",
      title: "رقم غير صالح",
      text: "ادخل رقم أكبر من 0",
    });

    questionsCount.focus();
    return;
  } else if (questionValue > data.length) {
    Swal.fire({
      icon: "warning",
      title: ` اكبر عدد ممكن ${data.length}`,
      text: "ادخل رقم اقل من يساوي" + data.length,
    });
    questionsCount.focus();
    return;
  }
  // data.sort(() => 0.5 - Math.random());

  // finalQuestion = data.slice(0, questionValue);

  // // finalQuestion = [];

  for (let i = 0; i < questionValue; i++) {
    let randomIndex = Math.floor(Math.random() * data.length);
    if (finalQuestion.includes(data[randomIndex])) {
      --i;
    } else {
      finalQuestion.push(data[randomIndex]);
    }
  }

  console.log(finalQuestion);

  return finalQuestion;
}

let subBtn = document.querySelector(".submit-button");
let cur = 0;

subBtn.onclick = function () {
  let selected = document.querySelector("input[name='question']:checked");
  if (!selected) {
    Swal.fire({
      icon: "error",
      title: " لا يمكن ان تكون الاجابه فارغه ",
      text: "اختار اجابه",
    });
  }
  checkAnswer(cur);
  cur++;
  if (cur >= finalQuestion.length) {
    Swal.fire({
      icon: "success",
      title: "انتهى الاختبار",
      html: `نتيجتك ${score} من ${finalQuestion.length} 🎉`,
      confirmButtonText: 'عرض الإجابات الصحيحة',
    }).then((result) => {
      // window.location.reload();
      if (result.isConfirmed) {
        // هنا نختار الديف ونغير الـ display
        document.querySelector(".answers-container").style.display = "block";
        document
          .querySelector(".answers-container")
          .scrollIntoView({ behavior: "smooth" });
      }
    });

    // return;
  }
  AddQuestions(finalQuestion, cur);
  // corected(finalQuestion,cur)
  questionsCountSelector.innerHTML = `${cur + 1} من ${questionValue} `;
};

function AddQuestions(sheet, cur) {
  let question = document.querySelector(".ask-area h2");

  let ans1 = document.querySelector(".answer-1");
  let ans2 = document.querySelector(".answer-2");
  let ans3 = document.querySelector(".answer-3");
  let ans4 = document.querySelector(".answer-4");
  question.innerHTML = sheet[cur].title;
  ans1.innerHTML = sheet[cur].answer_1;
  ans2.innerHTML = sheet[cur].answer_2;
  ans3.innerHTML = sheet[cur].answer_3;
  ans4.innerHTML = sheet[cur].answer_4;
  document.querySelectorAll('input[name="question"]').forEach((radio) => {
    radio.checked = false;
  });
}
function checkAnswer(index) {
  let selectedLabel = document
    .querySelector('input[name="question"]:checked + label')
    .textContent.trim();
  let rAnswer = finalQuestion[index].right_answer;
  if (!selectedLabel) return false;
  if (selectedLabel === rAnswer) {
    score++;
  }
  corected(finalQuestion, cur, selectedLabel);
}

function setTomes() {
  let minutes = document.querySelector(".minuts");
  let seconds = document.querySelector(".seconed");
  console.log(minutes);
  console.log(seconds);

  // تحويل النصوص لأرقام صحيحة
  let minCount = Number(minutes.textContent);
  let secCount = Number(seconds.textContent);

  if (quizArea.style.display === "block") {
    let timer = setInterval(() => {
      secCount--;

      if (secCount < 0) {
        secCount = 59;
        minCount--;
      }

      minutes.textContent = minCount;
      seconds.textContent = secCount;

      // لما الوقت يخلص
      if (minCount <= 0 && secCount <= 0) {
        clearInterval(timer);
        Swal.fire({
          icon: "خطا",
          title: "Oops...",
          text: " الوقت خلص",
        });
        // هنا ممكن تعمل إعادة تحميل الصفحة أو أي إجراء تاني
        setTimeout(() => {
          location.reload();
        }, 5000);
      }
    }, 1000);
  }
}
let containerAnser = document.querySelector(".answers-container");
function corected(paper, cur, slect) {
  let qustionDiv = document.createElement("div");
  qustionDiv.className = "comper";
  let questionHead = document.createElement("h2");
  qustionDiv.appendChild(document.createTextNode(paper[cur].title));
  qustionDiv.appendChild(questionHead);
  for (let i = 1; i <= 4; i++) {
    let ans = document.createElement("div");
    ans.className = `answer-${i}`;
    ans.textContent = `${i} - ${paper[cur][`answer_${i}`]}`;
    qustionDiv.appendChild(ans);
  }
  let dalelDiv = document.createElement("div")
  dalelDiv.className = "dalel"
  let spanchose = document.createElement("span")
  spanchose.appendChild(document.createTextNode("الاجابه المختارة"))
  dalelDiv.appendChild(spanchose)
  let spanCorect = document.createElement("span")
  spanCorect.appendChild(document.createTextNode("الاجابه الصحيحه"))
  dalelDiv.appendChild(spanCorect)
  qustionDiv.appendChild(dalelDiv)



  let resultDiv = document.createElement("div");

  resultDiv.className = "res";
  let chosenDiv = document.createElement("div");
  chosenDiv.className = "chosen";
  chosenDiv.textContent = slect;

  let corectDiv = document.createElement("div");
  corectDiv.textContent = paper[cur].right_answer;
  if (corectDiv.textContent === chosenDiv.textContent) {
    qustionDiv.classList.add("corect");
  } else {
    qustionDiv.classList.add("wrong");
  }
  corectDiv.className = "corect";
  resultDiv.append(chosenDiv,corectDiv);
  qustionDiv.appendChild(resultDiv);
  containerAnser.appendChild(qustionDiv);
}
