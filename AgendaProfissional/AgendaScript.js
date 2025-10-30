const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const calendar = document.getElementById("calendar");
const appointmentList = document.getElementById("appointmentList");

const months = [
  "Selecione um mês", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
let selectedDate = null;

// ==== Preencher selects ====
months.forEach((m, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = m;
  if (i === currentMonth) opt.selected = true;
  monthSelect.appendChild(opt);
});

for (let y = currentYear - 5; y <= currentYear + 5; y++) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  if (y === currentYear) opt.selected = true;
  yearSelect.appendChild(opt);
}

// ==== Renderizar calendário ====
function renderCalendar(month, year) {
  calendar.innerHTML = "";
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");

  const daysOfWeek = ["D", "S", "T", "Q", "Q", "S", "S"];
  daysOfWeek.forEach(d => {
    const header = document.createElement("div");
    header.textContent = d;
    header.style.fontWeight = "bold";
    calendar.appendChild(header);
  });

  for (let i = 0; i < firstDay; i++) calendar.appendChild(document.createElement("div"));

  for (let d = 1; d <= daysInMonth; d++) {
    const div = document.createElement("div");
    div.textContent = d;
    div.classList.add("day");

    const dateStr = `${year}-${month}-${d}`;
    const reservasDia = reservas.filter(r => r.date === dateStr);

    if (reservasDia.length > 0) div.classList.add("reserved");

    div.addEventListener("click", () => {
      document.querySelectorAll(".day").forEach(day => day.classList.remove("selected"));
      div.classList.add("selected");
      selectedDate = dateStr;
      mostrarConsultasDoDia(dateStr);
    });

    calendar.appendChild(div);
  }
}

// ==== Mostrar consultas do dia ====
function mostrarConsultasDoDia(dateStr) {
  appointmentList.innerHTML = "";
  const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");
  const consultas = reservas.filter(r => r.date === dateStr);

  if (consultas.length === 0) {
    appointmentList.innerHTML = "<li>Nenhuma consulta marcada para este dia.</li>";
    return;
  }

  consultas.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.time} - ${r.type} (${r.profissional})`;
    li.addEventListener("click", () => openModal(r));
    appointmentList.appendChild(li);
  });
}

// ==== Modal ====
const modal = document.getElementById("modal");
const closeModal = document.querySelector(".close");
const modalInfo = document.getElementById("modalInfo");

function openModal(consulta) {
  modal.style.display = "block";
  modalInfo.innerHTML = `
    <b>Profissional:</b> ${consulta.profissional}<br>
    <b>Data:</b> ${consulta.date}<br>
    <b>Hora:</b> ${consulta.time}<br>
    <b>Local:</b> ${consulta.local}<br>
    <b>Tipo:</b> ${consulta.type}
  `;
}

closeModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

function updateCalendar() {
  renderCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
}

monthSelect.addEventListener("change", updateCalendar);
yearSelect.addEventListener("change", updateCalendar);

document.getElementById("prevMonth").addEventListener("click", () => {
  let m = parseInt(monthSelect.value);
  let y = parseInt(yearSelect.value);
  if (m === 0) { m = 11; y--; } else m--;
  monthSelect.value = m; yearSelect.value = y;
  updateCalendar();
});
document.getElementById("nextMonth").addEventListener("click", () => {
  let m = parseInt(monthSelect.value);
  let y = parseInt(yearSelect.value);
  if (m === 11) { m = 0; y++; } else m++;
  monthSelect.value = m; yearSelect.value = y;
  updateCalendar();
});

renderCalendar(currentMonth, currentYear);
