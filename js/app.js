let waterCount = 0;

function addWater() {
  waterCount++;
  document.getElementById("water").innerText =
    waterCount + " / 8 glasses";
}

function saveSteps() {
  const steps = document.getElementById("stepsInput").value;
  document.getElementById("stepsResult").innerText =
    "Steps updated: " + steps;
}

function addMedicine() {
  const name = medName.value;
  const time = medTime.value;
  if (!name) return;

  const li = document.createElement("li");
  li.innerText = name + " (" + time + ")";
  medicineList.appendChild(li);

  medName.value = "";
}

function setMood(mood) {
  document.getElementById("moodResult").innerText =
    "Mood saved: " + mood;
}
/* ===== SCROLL REVEAL EFFECT ===== */

const sliders = document.querySelectorAll(".slide-in");

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;

  sliders.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
//* ===== ADVANCED BREATHING SYSTEM ===== */

let breathIntervals = [];
let paused = false;
let remaining = 0;
let phaseIndex = 0;

const modes = {
  calm:   [{t:"Inhale",d:4,c:"inhale"},
           {t:"Hold",d:4,c:"hold"},
           {t:"Exhale",d:6,c:"exhale"}],

  focus:  [{t:"Inhale",d:4,c:"inhale"},
           {t:"Hold",d:2,c:"hold"},
           {t:"Exhale",d:4,c:"exhale"}],

  sleep:  [{t:"Inhale",d:4,c:"inhale"},
           {t:"Hold",d:7,c:"hold"},
           {t:"Exhale",d:8,c:"exhale"}]
};

function startBreathing() {
  clearAll();
  paused = false;
  phaseIndex = 0;
  runPhase();
}

function runPhase() {
  if (paused) return;

  const mode = document.getElementById("breathMode").value;
  const phase = modes[mode][phaseIndex];

  const text = document.getElementById("breathText");
  const timer = document.getElementById("breathTimer");
  const circle = document.querySelector(".breath-circle");

  text.innerText = phase.t;
  circle.className = "breath-circle " + phase.c;

  let time = phase.d;
  timer.innerText = time;
  playSound();

  const interval = setInterval(() => {
    if (paused) return;
    time--;
    timer.innerText = time;
    if (time <= 0) {
      clearInterval(interval);
      phaseIndex = (phaseIndex + 1) % 3;
      updateMinutes();
      runPhase(); // LOOP
    }
  }, 1000);

  breathIntervals.push(interval);
}

function pauseBreathing() {
  paused = true;
}

function resumeBreathing() {
  if (!paused) return;
  paused = false;
  runPhase();
}

function clearAll() {
  breathIntervals.forEach(i => clearInterval(i));
  breathIntervals = [];
}

function playSound() {
  const beep = new Audio(
    "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="
  );
  beep.play();
}

function updateMinutes() {
  let mins = Number(localStorage.getItem("breathMinutes") || 0);
  mins += 0.25;
  localStorage.setItem("breathMinutes", mins);
  document.getElementById("breathMinutes").innerText = mins.toFixed(1);
}

window.addEventListener("load", () => {
  document.getElementById("breathMinutes").innerText =
    Number(localStorage.getItem("breathMinutes") || 0).toFixed(1);
});
/* ===== HEALTH SCORE LOGIC ===== */

function renderHealthScore(score) {
  const fill = document.getElementById("healthScoreFill");
  const value = document.getElementById("healthScoreValue");

  if (!fill || !value) return;

  value.innerText = score;
  fill.style.width = score + "%";
}

/* Example score (later can be calculated) */
window.addEventListener("load", () => {
  renderHealthScore(76);
});
/* ===== HEALTH SCORE ADVANCED LOGIC ===== */

function renderAdvancedHealthScore(score) {
  const bar = document.getElementById("healthScoreFill");
  const ring = document.getElementById("ringFill");
  const value = document.getElementById("scoreValue");

  if (!bar || !ring || !value) return;

  value.innerText = score;
  bar.style.width = score + "%";

  const circumference = 314;
  const offset = circumference - (score / 100) * circumference;
  ring.style.strokeDashoffset = offset;

  // Color logic
  if (score < 40) ring.style.stroke = "#ff4d4d";
  else if (score < 70) ring.style.stroke = "#f1c40f";
  else ring.style.stroke = "#2ecc71";
}

window.addEventListener("load", () => {
  renderAdvancedHealthScore(76);
});
function addWater() {
  waterCount++;
  document.getElementById("water").innerText =
    waterCount + " / 8 glasses";
  document.getElementById("waterFill").style.width =
    (waterCount / 8) * 100 + "%";
}
/* ===== FEMALE CORNER LOGIC ===== */

// Daily tips
const femaleTips = [
  "Irregular cycles can happen due to stress or travel.",
  "You don’t need to feel productive every day of your cycle.",
  "Pain during periods is common, but severe pain isn’t normal.",
  "Your mood can change with hormones — be gentle with yourself.",
  "Good hydration supports hormonal balance."
];

window.addEventListener("load", () => {
  const tip = femaleTips[Math.floor(Math.random() * femaleTips.length)];
  const tipBox = document.getElementById("femaleTip");
  if (tipBox) tipBox.innerText = tip;
});

// Anonymous question (frontend-safe)
function submitAnonymousQuestion() {
  const q = document.getElementById("anonQuestion").value;
  const status = document.getElementById("anonStatus");

  if (!q.trim()) {
    status.innerText = "Please type a question first.";
    return;
  }

  status.innerText = "Your question has been received anonymously 💗";
  document.getElementById("anonQuestion").value = "";
}
/* ===== MEDICINE DRAWER INTERACTIVITY ===== */

let totalMeds = 0;
let completedMeds = 0;

function addMedicine() {
  const name = medName.value;
  const dose = medDose.value;
  const time = medTime.value;

  if (!name || !dose) return;

  const list = document.getElementById("medicineList");

  // Remove empty message
  const empty = list.querySelector(".empty");
  if (empty) empty.remove();

  const li = document.createElement("li");

  li.innerHTML = `
    <div class="medicine-info">
      <strong>${name}</strong><br>
      <small>${dose} • ${time}</small>
    </div>
    <div class="medicine-actions">
      <button onclick="markTaken(this)">Taken</button>
      <button onclick="markMissed(this)">Missed</button>
    </div>
  `;

  list.appendChild(li);

  totalMeds++;
  updateMedProgress();

  medName.value = "";
  medDose.value = "";
}

function markTaken(btn) {
  const li = btn.closest("li");
  if (!li.classList.contains("taken")) {
    li.className = "taken";
    completedMeds++;
    updateMedProgress();
  }
}

function markMissed(btn) {
  const li = btn.closest("li");
  li.className = "missed";
  updateMedProgress();
}

function updateMedProgress() {
  const percent =
    totalMeds === 0 ? 0 : Math.round((completedMeds / totalMeds) * 100);

  document.getElementById("medProgressFill").style.width = percent + "%";
  document.getElementById("medProgressText").innerText =
    percent + "% completed";
}
/* ===== APPOINTMENT LOGIC ===== */

let upcoming = 0;
let completed = 0;

function addAppointment() {
  const name = doctorName.value.trim();
  const type = doctorType.value.trim();
  const date = appointmentDate.value;
  const time = appointmentTime.value;

  if (!name || !date || !time) {
    alert("Please fill all required fields");
    return;
  }

  const list = document.getElementById("appointmentList");

  const empty = list.querySelector(".empty");
  if (empty) empty.remove();

  const li = document.createElement("li");
  li.className = "upcoming";

  li.innerHTML = `
    <div class="appointment-info">
      <strong>Dr. ${name}</strong><br>
      <small>${type}</small><br>
      <small>${date} • ${time}</small>
    </div>
    <div class="appointment-actions">
      <button onclick="markCompleted(this)">Done</button>
      <button onclick="cancelAppointment(this)">Cancel</button>
    </div>
  `;

  list.appendChild(li);
  upcoming++;
  updateSummary();

  doctorName.value = "";
  doctorType.value = "";
}

function markCompleted(btn) {
  const li = btn.closest("li");
  if (!li.classList.contains("completed")) {
    li.className = "completed";
    completed++;
    upcoming--;
    updateSummary();
  }
}

function cancelAppointment(btn) {
  const li = btn.closest("li");
  li.className = "cancelled";
  upcoming--;
  updateSummary();
}

function updateSummary() {
  document.getElementById("upcomingCount").innerText = Math.max(upcoming, 0);
  document.getElementById("completedCount").innerText = completed;
}
/* ===== EMERGENCY SOS LOGIC ===== */

function openSOS() {
  document.getElementById("sosModal").style.display = "flex";
}

function closeSOS() {
  document.getElementById("sosModal").style.display = "none";
}

function shareLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      () => alert("📍 Location shared successfully (demo)"),
      () => alert("Unable to access location")
    );
  } else {
    alert("Geolocation not supported");
  }
}

function showGuide() {
  alert(
    "Emergency Tips:\n\n" +
    "• Stay calm and breathe\n" +
    "• Call emergency services\n" +
    "• If bleeding, apply pressure\n" +
    "• Do not panic – help is on the way"
  );
}
/* ===== REPORTS MODULE ===== */

let reports = [];

function addReport() {
  const name = reportName.value.trim();
  const type = reportType.value;
  const file = reportFile.files[0];

  if (!name || !file) {
    alert("Please enter report name and select a file");
    return;
  }

  const report = {
    name,
    type,
    date: new Date().toLocaleDateString()
  };

  reports.push(report);
  renderReports();

  reportName.value = "";
  reportFile.value = "";
}

function renderReports(filter = "All") {
  const list = document.getElementById("reportList");
  list.innerHTML = "";

  let filtered = reports;
  if (filter !== "All") {
    filtered = reports.filter(r => r.type === filter);
  }

  if (filtered.length === 0) {
    list.innerHTML = `<li class="empty">No reports found 📂</li>`;
    return;
  }

  filtered.forEach((r, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="report-info">
        <strong>${r.name}</strong><br>
        <small>${r.date}</small><br>
        <span class="report-type">${r.type}</span>
      </div>
      <div class="report-actions">
        <button onclick="viewReport()">View</button>
        <button onclick="deleteReport(${index})">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });
}

function deleteReport(index) {
  if (!confirm("Delete this report?")) return;
  reports.splice(index, 1);
  renderReports();
}

function viewReport() {
  alert("Report opened (demo mode)");
}

function filterReports() {
  const type = document.getElementById("filterType").value;
  renderReports(type);
}
