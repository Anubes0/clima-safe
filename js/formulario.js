// Validação do formulário de cadastro, com erro e sucesso na própria página.

const form = document.getElementById("form-cadastro");
const mensagemSucesso = document.getElementById("mensagem-sucesso");
preencherSelectBairros(document.getElementById("bairro"));
if (estado.bairro) document.getElementById("bairro").value = estado.bairro;   // bairro do simulador

// Mensagem vazia apaga o erro
function marcarErro(campo, mensagem) {
  const elemento = document.getElementById(campo === "canal" ? "grupo-canal" : campo);
  document.getElementById("erro-" + campo).textContent = mensagem;
  if (mensagem) {
    elemento.setAttribute("aria-invalid", "true");
  } else {
    elemento.removeAttribute("aria-invalid");
  }
}

form.addEventListener("submit", function (evento) {
  evento.preventDefault();   // a página não recarrega
  mensagemSucesso.textContent = "";

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const bairroId = document.getElementById("bairro").value;
  const canal = form.querySelector('input[name="canal"]:checked');
  const aceite = document.getElementById("aceite").checked;

  const regras = [
    { campo: "nome", certo: nome.length >= 3, mensagem: "Informe seu nome (mínimo 3 letras)." },
    { campo: "email", certo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), mensagem: "Informe um e-mail válido." },
    { campo: "telefone", certo: telefone === "" || /^\d{10,11}$/.test(telefone), mensagem: "Telefone com DDD, só números." },
    { campo: "bairro", certo: bairroId !== "", mensagem: "Escolha seu bairro." },
    { campo: "canal", certo: canal !== null, mensagem: "Escolha como quer receber o alerta." },
    { campo: "aceite", certo: aceite, mensagem: "É preciso aceitar para receber alertas." }
  ];

  let primeiroErro = null;
  for (const regra of regras) {
    marcarErro(regra.campo, regra.certo ? "" : regra.mensagem);
    if (!regra.certo && primeiroErro === null) primeiroErro = regra.campo;
  }

  // Foco no primeiro campo com erro
  if (primeiroErro !== null) {
    document.getElementById(primeiroErro === "canal" ? "canal-email" : primeiroErro).focus();
    return;
  }

  // Guarda só a contagem por bairro; nome, e-mail e telefone não são salvos
  estado.cadastros[bairroId] = (estado.cadastros[bairroId] || 0) + 1;
  salvarEstado();

  const bairro = buscarBairro(bairroId);
  mensagemSucesso.textContent = "Cadastro feito! Você vai receber alertas do bairro " + bairro.nome + ". " +
    "Enquanto o Clima Safe é um protótipo, cadastre também o seu CEP no alerta oficial da Defesa Civil: " +
    "mande um SMS com o CEP para 40199.";
  form.reset();
});
