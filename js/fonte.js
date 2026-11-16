// fonte.js — botões A− e A+ do topo: mudam o tamanho do texto do site todo.
// O tamanho fica em estado.fonte (estado.js) e vale para todas as páginas.

const TAMANHOS = ["fonte-pequena", "fonte-normal", "fonte-grande", "fonte-maior"];

const botaoMenor = document.getElementById("fonte-menor");
const botaoMaior = document.getElementById("fonte-maior");

function aplicarTamanho() {
  for (const classe of TAMANHOS) {
    document.documentElement.classList.remove(classe);
  }
  document.documentElement.classList.add(TAMANHOS[estado.fonte]);
  // No limite, o botão fica desativado: é o aviso de que não dá para ir além
  botaoMenor.disabled = estado.fonte === 0;
  botaoMaior.disabled = estado.fonte === TAMANHOS.length - 1;
}

botaoMenor.addEventListener("click", function () {
  estado.fonte--;
  salvarEstado();
  aplicarTamanho();
});

botaoMaior.addEventListener("click", function () {
  estado.fonte++;
  salvarEstado();
  aplicarTamanho();
});

quandoEstadoMudar(aplicarTamanho);
aplicarTamanho();
