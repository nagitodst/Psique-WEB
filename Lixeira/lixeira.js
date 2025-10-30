function getTrash() {
    return JSON.parse(localStorage.getItem("lixeira")) || [];
  }
  
  function saveTrash(trash) {
    localStorage.setItem("lixeira", JSON.stringify(trash));
  }
  
  function renderTrash() {
    const container = document.getElementById("trashContainer");
    const trash = getTrash();
    container.innerHTML = "";
  
    trash.forEach((note, index) => {
      const div = document.createElement("div");
      div.classList.add("note");
      div.textContent = note;
  
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        showMenu(e.pageX, e.pageY, index);
      });
  
      container.appendChild(div);
    });
  }

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.right = sidebar.style.right === "0px" ? "-220px" : "0px";
}

  
  function showMenu(x, y, index) {
    const menu = document.createElement("div");
    menu.classList.add("menu");
    menu.innerHTML = `
      <button onclick="restore(${index})">Recuperar nota</button>
    `;
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    document.body.appendChild(menu);
    menu.style.display = "block";
  
    document.addEventListener("click", () => menu.remove(), { once: true });
  }
  
  function restore(index) {
    const trash = getTrash();
    const diario = JSON.parse(localStorage.getItem("diario")) || [];
    diario.push(trash[index]);
    trash.splice(index, 1);
    saveTrash(trash);
    localStorage.setItem("diario", JSON.stringify(diario));
    renderTrash();
  }
  
  renderTrash();
  