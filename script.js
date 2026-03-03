const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzmElnW1a2UN1tnEQ8XFr-MG2Em10qNeTbI6rpEZcpOqvueOODs2ViYC6Ugv1LXwINr/exec";

const SENHA_ADMIN = "072026";

const lista = document.getElementById("lista");

async function carregarLista() {
  const response = await fetch(URL_SCRIPT);
  const data = await response.json();

  lista.innerHTML = "";

  data.forEach((item, index) => {
    const nome = item[0];
    const confirmado = item[1];

    const li = document.createElement("li");

    li.textContent = `${index + 1}° - ${nome}`;

    if (confirmado === "SIM") {
      li.textContent += " ✅";
      li.style.background = "#d4edda";
      li.style.fontWeight = "bold";
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

  if (!nome) {
    alert("Digite seu nome!");
    return;
  }

  const response = await fetch(URL_SCRIPT, {
    method: "POST",
    body: new URLSearchParams({ nome })
  });

  const result = await response.text();

  if (result === "EXISTE") {
    alert("Esse nome já está na lista!");
  } else {
    nomeInput.value = "";
    carregarLista();
  }
}

function abrirAdmin() {
  document.getElementById("adminModal").style.display = "block";
}

function fecharAdmin() {
  document.getElementById("adminModal").style.display = "none";
}

function verificarSenha() {
  const senha = document.getElementById("senhaAdmin").value;

  if (senha === SENHA_ADMIN) {
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
      ${nome} ${confirmado === "SIM" ? "✅" : ""}
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

carregarLista();