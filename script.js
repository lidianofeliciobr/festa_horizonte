const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzmElnW1a2UN1tnEQ8XFr-MG2Em10qNeTbI6rpEZcpOqvueOODs2ViYC6Ugv1LXwINr/exec";

/* ===== COPIAR PIX ===== */

function copiarPix() {
  const chave = document.getElementById("pixKey").textContent;

  navigator.clipboard.writeText(chave);

  const msg = document.getElementById("pixMsg");
  msg.textContent = "✅ Chave PIX copiada!";
  
  setTimeout(() => {
    msg.textContent = "";
  }, 3000);
}

/* ===== CARREGAR LISTA ===== */

async function carregarLista() {
  const resposta = await fetch(URL_SCRIPT);
  const nomes = await resposta.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  nomes.forEach((nome) => {
    const li = document.createElement("li");
    li.textContent = nome;
    lista.appendChild(li);
  });
}

/* ===== ADICIONAR NOME ===== */

async function adicionarNome() {
  const input = document.getElementById("nome");
  const nome = input.value.trim();

  if (!nome) {
    alert("Digite seu nome!");
    return;
  }

  input.value = "";

  await fetch(URL_SCRIPT, {
    method: "POST",
    body: new URLSearchParams({ nome })
  });

  // 🔥 MENSAGEM CONFIRMADO
  const msg = document.getElementById("msgConfirmacao");
  msg.textContent = "✅ CONFIRMADO!";
  msg.style.display = "block";

  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);

  carregarLista();
}

carregarLista();
