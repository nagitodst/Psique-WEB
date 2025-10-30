function getNotes() {
  return JSON.parse(localStorage.getItem("diario")) || [];
}

function saveNotes(notes) {
  localStorage.setItem("diario", JSON.stringify(notes));
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.right = sidebar.style.right === "0px" ? "-220px" : "0px";
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function renderNotes() {
  const container = document.getElementById("notesContainer");
  const notes = getNotes();
  container.innerHTML = "";

  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.classList.add("note");
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";

    const textArea = document.createElement("div");
    textArea.classList.add("note-text");
    textArea.contentEditable = true;
    textArea.innerText = note.text;

    textArea.addEventListener("input", () => {
      note.text = textArea.innerText.trim();
      note.editedAt = new Date().toISOString();
      saveNotes(notes);
      renderNotes();
    });

    const info = document.createElement("small");
    info.style.display = "block";
    info.style.marginTop = "8px";
    info.style.fontSize = "12px";
    info.style.color = "#555";
    info.textContent = `Criado: ${formatDate(note.createdAt)}`;
    if (note.editedAt) {
      info.textContent += ` | Editado: ${formatDate(note.editedAt)}`;
    }

    const menuBtn = document.createElement("button");
    menuBtn.classList.add("menu-icon");
    menuBtn.innerHTML = "⋮";
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showMenu(e, index, div);
    });

    div.appendChild(menuBtn);
    div.appendChild(textArea);
    div.appendChild(info);
    container.appendChild(div);
  });
}

function showMenu(event, index, noteElement) {
  const existingMenu = document.querySelector(".menu");
  if (existingMenu) existingMenu.remove();

  const menu = document.createElement("div");
  menu.classList.add("menu");
  menu.innerHTML = `
    <button class="delete">Excluir nota</button>
    <button class="copy">Fazer uma cópia</button>
    <button class="pin">Fixar nota</button>
    <button class="share">Compartilhar nota</button>
  `;
  noteElement.appendChild(menu);

  menu.style.top = `${event.target.offsetTop + 25}px`;
  menu.style.left = `${event.target.offsetLeft - 130}px`;

  menu.querySelector(".delete").addEventListener("click", () => {
    deleteNote(index);
    menu.remove();
  });
  menu.querySelector(".copy").addEventListener("click", () => {
    duplicate(index);
    menu.remove();
  });
  menu.querySelector(".pin").addEventListener("click", () => {
    pin(index);
    menu.remove();
  });
  menu.querySelector(".share").addEventListener("click", () => {
    share(index);
    menu.remove();
  });

  document.addEventListener(
    "click",
    function handler(e) {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener("click", handler);
      }
    }
  );
}

function deleteNote(index) {
  const notes = getNotes();
  const trash = JSON.parse(localStorage.getItem("lixeira")) || [];
  trash.push(notes[index]);
  notes.splice(index, 1);
  saveNotes(notes);
  localStorage.setItem("lixeira", JSON.stringify(trash));
  renderNotes();
}

function duplicate(index) {
  const notes = getNotes();
  const copy = { ...notes[index], createdAt: new Date().toISOString() };
  notes.push(copy);
  saveNotes(notes);
  renderNotes();
}

function pin(index) {
  const notes = getNotes();
  const pinned = notes.splice(index, 1)[0];
  notes.unshift(pinned);
  saveNotes(notes);
  renderNotes();
}

function share(index) {
  const notes = getNotes();
  const note = notes[index];
  const sharedNotes = JSON.parse(localStorage.getItem("notasCompartilhadas")) || [];
  const now = new Date().toISOString();
  sharedNotes.push({
    ...note,
    sharedAt: now,
  });
  localStorage.setItem("notasCompartilhadas", JSON.stringify(sharedNotes));
  window.location.href = "../Notas/notas.html";
}

const noteInput = document.getElementById("noteText");

document.getElementById("addNote").addEventListener("click", addNote);

noteInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    addNote();
  }
});

function addNote() {
  const text = noteInput.value.trim();
  if (text === "") return;
  const notes = getNotes();
  notes.push({
    text: text,
    createdAt: new Date().toISOString(),
  });
  saveNotes(notes);
  noteInput.value = "";
  renderNotes();
}

renderNotes();
