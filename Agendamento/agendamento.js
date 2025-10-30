// ===== Modalidade =====
const btnPresencial = document.getElementById("btnPresencial");
const btnOnline = document.getElementById("btnOnline");

btnPresencial.onclick = () => {
  btnPresencial.classList.add("active");
  btnOnline.classList.remove("active");
};
btnOnline.onclick = () => {
  btnOnline.classList.add("active");
  btnPresencial.classList.remove("active");
};

// ===== Horários =====
const horarios = document.querySelectorAll("#horarios button");
horarios.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("time-reserved")) return;
    horarios.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ===== CALENDÁRIO =====
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const calendar = document.getElementById("calendar");
const months = [
  "Selecione um mês", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
let selectedDate = null;

months.forEach((m, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = m;
  if (i === currentMonth) opt.selected = true;
  monthSelect.appendChild(opt);
});

for (let y = currentYear - 10; y <= currentYear + 10; y++) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  if (y === currentYear) opt.selected = true;
  yearSelect.appendChild(opt);
}

function renderCalendar(month, year) {
  calendar.innerHTML = "";
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysOfWeek = ["D", "S", "T", "Q", "Q", "S", "S"];
  daysOfWeek.forEach(d => {
    const header = document.createElement("div");
    header.textContent = d;
    header.style.fontWeight = "bold";
    calendar.appendChild(header);
  });

  for (let i = 0; i < firstDay; i++) calendar.appendChild(document.createElement("div"));

  const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");

  // Verifica se o mês inteiro está reservado
  const diasReservadosNoMes = new Set(
    reservas.filter(r => {
      const [y, m] = r.date.split("-").map(Number);
      return y === year && m === month;
    }).map(r => r.date)
  );
  const diasTotais = Array.from({ length: daysInMonth }, (_, i) => `${year}-${month}-${i + 1}`);
  const mesCompletoReservado = diasTotais.every(dia => diasReservadosNoMes.has(dia));

  if (mesCompletoReservado) {
    monthSelect.classList.add("month-reserved");
  } else {
    monthSelect.classList.remove("month-reserved");
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const div = document.createElement("div");
    div.textContent = d;
    div.classList.add("day");
    const dateStr = `${year}-${month}-${d}`;

    const reservasDia = reservas.filter(r => r.date === dateStr);
    if (reservasDia.length >= horarios.length) div.classList.add("reserved");

    div.addEventListener("click", () => {
      if (div.classList.contains("reserved")) return;
      document.querySelectorAll(".day").forEach(day => day.classList.remove("selected"));
      div.classList.add("selected");
      selectedDate = dateStr;
      atualizarHorariosReservados(dateStr);
    });

    calendar.appendChild(div);
  }
}

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

// ===== SALVAR RESERVA =====
document.querySelector(".save-btn").addEventListener("click", () => {
  const horario = document.querySelector("#horarios button.active");
  const tipo = btnPresencial.classList.contains("active")
    ? "Presencial"
    : btnOnline.classList.contains("active")
      ? "Online"
      : null;

  if (!selectedDate || !horario || !tipo) {
    alert("Selecione tipo, data e horário.");
    return;
  }

  let reservas = JSON.parse(localStorage.getItem("reservas") || "[]");
  const horarioSelecionado = horario.textContent;

  if (reservas.find(r => r.date === selectedDate && r.time === horarioSelecionado)) {
    alert("Este horário já foi reservado!");
    return;
  }

  const nova = {
    date: selectedDate,
    time: horarioSelecionado,
    type: tipo,
    profissional: "Dra. Maria Souza",
    local: tipo === "Presencial" ? "Clínica Psique - Sala 2" : "Online (Google Meet)"
  };

  reservas.push(nova);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  horario.classList.add("time-reserved");
  horario.disabled = true;

  alert("Consulta marcada com sucesso!");
  updateAppointments();
  updateCalendar();
  atualizarHorariosReservados(selectedDate);
});

// ===== ATUALIZAR HORÁRIOS RESERVADOS =====
function atualizarHorariosReservados(dateStr) {
  const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");
  horarios.forEach(btn => {
    const reservado = reservas.find(r => r.date === dateStr && r.time === btn.textContent);
    if (reservado) {
      btn.classList.add("time-reserved");
      btn.disabled = true;
    } else {
      btn.classList.remove("time-reserved");
      btn.disabled = false;
    }
  });
}

// ===== LISTA DE CONSULTAS =====
function updateAppointments() {
  const list = document.getElementById("appointmentList");
  list.innerHTML = "";
  const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");

  reservas.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.date} - ${r.time} (${r.type})`;
    li.addEventListener("click", () => openModal(r));
    list.appendChild(li);
  });
}

// ===== MODAL =====
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

// ===== CANCELAR CONSULTA =====
const cancelarConsultaBtn = document.getElementById("cancelarConsultaBtn");
let consultaAtual = null;

function openModal(consulta) {
  modal.style.display = "block";
  consultaAtual = consulta;
  modalInfo.innerHTML = `
    <b>Profissional:</b> ${consulta.profissional}<br>
    <b>Data:</b> ${consulta.date}<br>
    <b>Hora:</b> ${consulta.time}<br>
    <b>Local:</b> ${consulta.local}<br>
    <b>Tipo:</b> ${consulta.type}
  `;
}

cancelarConsultaBtn.addEventListener("click", () => {
  if (!consultaAtual) return;
  if (confirm("Tem certeza que deseja cancelar esta consulta?")) {
    let reservas = JSON.parse(localStorage.getItem("reservas") || "[]");
    reservas = reservas.filter(r => !(r.date === consultaAtual.date && r.time === consultaAtual.time));
    localStorage.setItem("reservas", JSON.stringify(reservas));
    alert("Consulta cancelada com sucesso!");
    modal.style.display = "none";
    updateAppointments();
    updateCalendar();
  }
});


updateAppointments();

