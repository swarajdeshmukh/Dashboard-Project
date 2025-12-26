function openFeatures() {
  const allElems = document.querySelectorAll(".elem");
  const fullElemPage = document.querySelectorAll(".fullElem");
  const fullElemPageBackBtn = document.querySelectorAll(".fullElem .back");

  // ✅ Restore last opened section on reload
  const activeSection = localStorage.getItem("activeSection");
  if (activeSection !== null) {
    fullElemPage[activeSection].style.display = "block";
    document.body.style.overflowY = 'hidden'
  }

  allElems.forEach(function (elem) {
    elem.addEventListener("click", function () {
      fullElemPage[elem.id].style.display = "block";
      document.body.style.overflowY = 'hidden'
      localStorage.setItem("activeSection", elem.id); // ✅ save section
    });
  });

  fullElemPageBackBtn.forEach(function (back) {
    back.addEventListener("click", function () {
      fullElemPage[back.id].style.display = "none";
      document.body.style.overflowY = 'scroll'
      localStorage.removeItem("activeSection"); // ✅ go back to home
    });
  });
}

// To-Do Page
function toDo() {
  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector(".addTask form input");
  let taskDescriptionInput = document.querySelector(".addTask form textarea");
  let taskCheckBox = document.querySelector(".addTask form #check");
  let allTask = document.querySelector(".allTask");

  let currentTask = [];

  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  }

  function renderTask() {
    let sum = "";

    currentTask.forEach(function (ele, idx) {
      sum += `
        <div class="task">
          <h5>
            ${ele.task}
            <span class="${ele.imp ? "true" : "false"}">imp</span>
          </h5>
          <p>${ele.details}</p>
          <button id="${idx}">Delete</button>
        </div>
      `;
    });

    allTask.innerHTML = sum;
    localStorage.setItem("currentTask", JSON.stringify(currentTask));

    let deleteBtn = document.querySelectorAll(".task button");
    deleteBtn.forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentTask.splice(btn.id, 1);
        renderTask();
      });
    });
  }

  renderTask();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    currentTask.push({
      task: taskInput.value,
      details: taskDescriptionInput.value,
      imp: taskCheckBox.checked,
    });

    renderTask();
    e.target.reset();
  });
}

// Daily Planner
function dailyPlanner() {
  let dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};
  let dailyPlannerContainer = document.querySelector(
    ".daily-planner-container"
  );
  let hours = Array.from({ length: 18 }, function (_, idx) {
    return `${6 + idx}:00 - ${7 + idx}:00`;
  });

  let wholeDaySum = "";

  hours.forEach(function (elem, idx) {
    let values = dayPlanData[idx] || "";
    wholeDaySum += `
        <div class="daily-planner">
            <h4>${elem}</h4>
            <input id=${idx} type="text" placeholder="Add Task..." value="${values}">
        </div>
    `;
  });
  dailyPlannerContainer.innerHTML = wholeDaySum;

  let DailyPlannerInput = document.querySelectorAll(".daily-planner input");

  DailyPlannerInput.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;
      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}

//Motivation qoutes
function motivationQoutes() {
  const h3 = document.querySelector(".motivation-quote h3");
  const p = document.querySelector(".motivation-quote p");

  async function fetchingData() {
    try {
      const response = await fetch("https://dummyjson.com/quotes/random");
      const data = await response.json();

      const formatQuote = `"${data.quote}"`;
      const formatAuthore = `- ${data.author}`;

      h3.textContent = formatQuote;
      p.textContent = formatAuthore;
    } catch (err) {
      console.error(err.message);
    }
  }

  fetchingData();
}

//Pomodoro Timer
function pomodoroTimer() {
  const audio = new Audio("funnyTimeUp.mp3");
  audio.loop = false;

  // Load timer from localStorage or default 25 minutes
  let timerSeconds = parseInt(localStorage.getItem("timerSeconds")) || 25 * 60;
  let isRunning = localStorage.getItem("isRunning") === "true" || false;
  let timeInterval = null;

  const h2 = document.querySelector(".watch-container h2");
  const startbtn = document.querySelector(".pomo-btns .start-btn");
  const pausebtn = document.querySelector(".pomo-btns .pause-btn");
  const resetbtn = document.querySelector(".pomo-btns .reset-btn");

  function updateTime() {
    if (timerSeconds <= 0) {
      pauseTimer();
      playSound();
      timerSeconds = 25 * 60;
    }

    let minutes = Math.floor(timerSeconds / 60);
    let seconds = timerSeconds % 60;

    h2.innerHTML = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;

    // Save current time to localStorage
    localStorage.setItem("timerSeconds", timerSeconds);
  }

  function startTimer() {
    // Unlock audio
    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
      })
      .catch(() => {});

    if (timeInterval) return; // already running
    isRunning = true;
    localStorage.setItem("isRunning", "true");

    timeInterval = setInterval(() => {
      timerSeconds--;
      updateTime();
      if (timerSeconds <= 0) {
        pauseTimer();
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timeInterval);
    timeInterval = null;
    isRunning = false;
    localStorage.setItem("isRunning", "false");
  }

  function resetTimer() {
    clearInterval(timeInterval);
    timeInterval = null;
    timerSeconds = 25 * 60;
    isRunning = false;
    updateTime();
    localStorage.setItem("timerSeconds", timerSeconds);
    localStorage.setItem("isRunning", "false");
  }

  function playSound() {
    audio.currentTime = 0;
    audio.play();
  }

  startbtn.addEventListener("click", startTimer);
  pausebtn.addEventListener("click", pauseTimer);
  resetbtn.addEventListener("click", resetTimer);

  // On page load, restore timer state
  updateTime();
  if (isRunning) startTimer();
}

const APIKEY = "2529b7110fff4a48ad0122024252312";
const CITY = "pune";

const temperature = document.querySelector(".temperature");
const typDay = document.querySelector(".typDay");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const locationdata = document.querySelector(".location");

async function headerData() {
  try {
    let response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${APIKEY}&q=${CITY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    let data = await response.json();

    temperature.textContent = `${data.current.temp_c} °C`;
    typDay.textContent = data.current.condition.text;

    humidity.textContent = `humidity: ${data.current.humidity}%`;
    wind.textContent = `Wind: ${data.current.wind_kph} Km/h`;
    locationdata.textContent = `${data.location.name}, ${data.location.region} `;
  } catch (err) {
    console.error("Error:", err.message);
  }

  DayDate();
}

function DayDate() {
  const date = document.querySelector(".date");
  const dayTime = document.querySelector(".dayTime");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dateData = new Date();

  // Date
  date.textContent = `${dateData.getDate()} ${
    months[dateData.getMonth()]
  }, ${dateData.getFullYear()}`;

  // Time logic
  let hours = dateData.getHours();
  let minutes = dateData.getMinutes();
  let seconds = dateData.getSeconds();
  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert 0 → 12
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Day + Time
  dayTime.textContent = `${
    weekDays[dateData.getDay()]
  }, ${String(hours).padStart('2','0')}:${String(minutes).padStart('2','0')}:${String(seconds).padStart('2','0')} ${ampm}`;
}


setInterval(()=>{
  DayDate()
  // console.log('timer')
},1000)

headerData();
openFeatures();
toDo();
dailyPlanner();
motivationQoutes();
pomodoroTimer();
