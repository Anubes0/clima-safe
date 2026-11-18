// Botões de leitura de todas as páginas: tamanho do texto (A- e A+) e alto contraste.
// As classes do <html> são aplicadas por estado.js, já no <head>.

const botaoMenor = document.getElementById("fonte-menor");
const botaoMaior = document.getElementById("fonte-maior");
const botaoContraste = document.getElementById("alto-contraste");

function aplicarAjustes() {
  aplicarClassesDeLeitura();   // estado.js
  // No limite, o botão fica desativado
  botaoMenor.disabled = estado.fonte === 0;
  botaoMaior.disabled = estado.fonte === TAMANHOS.length - 1;
  botaoContraste.setAttribute("aria-pressed", String(estado.contraste));
}

botaoMenor.addEventListener("click", function () {
  estado.fonte--;
  salvarEstado();
  aplicarAjustes();
});

botaoMaior.addEventListener("click", function () {
  estado.fonte++;
  salvarEstado();
  aplicarAjustes();
});

botaoContraste.addEventListener("click", function () {
  estado.contraste = !estado.contraste;
  salvarEstado();
  aplicarAjustes();
});

quandoEstadoMudar(aplicarAjustes);
aplicarAjustes();
