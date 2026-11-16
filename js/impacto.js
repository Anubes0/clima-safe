// impacto.js — números da página Impacto.
// Uma parte vem da lista de bairros; a outra, dos cadastros e alertas guardados em estado.js.

function escrever(id, texto) {
  document.getElementById(id).textContent = texto;
}

function formatarHoras(horas) {
  return String(Math.round(horas * 10) / 10).replace(".", ",") + " h";
}

// Bairros, moradores e bairros de risco alto
let moradores = 0;
let bairrosRiscoAlto = 0;
for (const bairro of BAIRROS) {
  moradores += bairro.populacaoEstimada;
  if (bairro.vulnerabilidade === 3) bairrosRiscoAlto++;
}
escrever("ind-bairros", BAIRROS.length);
escrever("ind-populacao", moradores.toLocaleString("pt-BR"));
escrever("ind-alta", bairrosRiscoAlto);

// Cadastros e alertas: mudam quando alguém se cadastra ou gera um alerta em outra página
function mostrarCadastrosEAlertas() {
  let totalCadastros = 0;
  let itens = "";
  for (const bairro of BAIRROS) {
    const total = estado.cadastros[bairro.id] || 0;
    totalCadastros += total;
    if (total > 0) itens += `<li>${bairro.nome}: ${total}</li>`;
  }
  escrever("ind-cadastros", totalCadastros);
  document.getElementById("lista-cadastros").innerHTML = itens || "<li>Nenhum cadastro feito ainda.</li>";

  escrever("ind-alertas", estado.alertas);
  if (estado.alertasComPrevisao === 0) {
    escrever("ind-antecedencia", "sem dados");
    escrever("ind-antecedencia-nota", "Aparece quando a previsão real indicar alerta amarelo ou mais.");
  } else {
    escrever("ind-antecedencia", formatarHoras(estado.horasAntecedencia / estado.alertasComPrevisao));
    escrever("ind-antecedencia-nota", "Média de " + estado.alertasComPrevisao + " alerta(s) com previsão real.");
  }
}

quandoEstadoMudar(mostrarCadastrosEAlertas);
mostrarCadastrosEAlertas();
