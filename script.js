const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzmElnW1a2UN1tnEQ8XFr-MG2Em10qNeTbI6rpEZcpOqvueOODs2ViYC6Ugv1LXwINr/exec";
const SENHA_ADMIN = "072026";
const lista = document.getElementById("lista");

async function carregarLista() {
  const response = await fetch(URL_SCRIPT);
  const data = await response.json();

  lista.innerHTML = "";

  const confirmados = data.filter(item => item[1] === "SIM");
  const naoConfirmados = data.filter(item => item[1] !== "SIM");
  const listaOrdenada = [...confirmados, ...naoConfirmados];

  listaOrdenada.forEach(item => {
    const nome = item[0];
    const confirmado = item[1];

    const li = document.createElement("li");
    li.innerHTML = `<strong>${nome}</strong>`;

    if (confirmado === "SIM") {
      li.innerHTML += " ✅";
      li.style.background = "#d4edda";
      li.style.padding = "5px";
      li.style.borderRadius = "5px";
    }

    lista.appendChild(li);
  });

  atualizarAdminLista(data);
}

async function adicionarNome() {
  const nomeInput = document.getElementById("nome");
  const nome = nomeInput.value.trim();
  if (!nome) return alert("Digite seu nome!");

  nomeInput.value = "";

  await fetch(URL_SCRIPT, {
    method: "POST",
    body: new URLSearchParams({ nome })
  });

  const msg = document.getElementById("msgConfirmacao");
  msg.textContent = "Confirmado";
  msg.style.display = "block";
  setTimeout(() => msg.style.display = "none", 3000);

  carregarLista();
}

function copiarPix() {
  const chave = document.getElementById("pixKey").textContent;
  const msg = document.getElementById("pixMsg");

  navigator.clipboard.writeText(chave);

  msg.textContent = "Chave Pix copiada";
  msg.style.display = "block";

  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);
}

function abrirAdmin() {
  document.getElementById("adminModal").style.display = "flex";
}

function fecharAdmin() {
  document.getElementById("adminModal").style.display = "none";
  document.getElementById("adminArea").style.display = "none";
  document.getElementById("loginAdmin").style.display = "block";
  document.getElementById("senhaAdmin").value = "";
}

function verificarSenha() {
  const senha = document.getElementById("senhaAdmin").value;
  if (senha === SENHA_ADMIN) {
    document.getElementById("loginAdmin").style.display = "none";
    document.getElementById("adminArea").style.display = "block";
  } else {
    alert("Senha incorreta!");
  }
}

function atualizarAdminLista(data) {
  const adminLista = document.getElementById("adminLista");
  adminLista.innerHTML = "";

  data.forEach((item, index) => {
    const nome = item[0];
    const confirmado = item[1];

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${nome}</strong> ${confirmado === "SIM" ? "✅" : ""}
      <button onclick="confirmar(${index})">Confirmar</button>
      <button onclick="remover(${index})">Remover</button>
    `;

    adminLista.appendChild(li);
  });
}

async function confirmar(index) {
  await fetch(URL_SCRIPT, {
    method: "POST",
    body: new URLSearchParams({ acao: "confirmar", linha: index + 2 })
  });
  carregarLista();
}

async function remover(index) {
  await fetch(URL_SCRIPT, {
    method: "POST",
    body: new URLSearchParams({ acao: "remover", linha: index + 2 })
  });
  carregarLista();
}

window.adicionarNome = adicionarNome;
window.abrirAdmin = abrirAdmin;
window.fecharAdmin = fecharAdmin;
window.verificarSenha = verificarSenha;
window.confirmar = confirmar;
window.remover = remover;
window.copiarPix = copiarPix;

carregarLista();
