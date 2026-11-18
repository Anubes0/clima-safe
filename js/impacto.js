// Indicadores e gráficos da página Impacto.
// Os gráficos são barras em SVG: as larguras vão nos atributos, sem CSS inline.

const RISCOS = [
  { nivel: 3, nome: "alto", classe: "risco-alto" },
  { nivel: 2, nome: "médio", classe: "risco-medio" },
  { nivel: 1, nome: "baixo", classe: "risco-baixo" }
];

function escrever(id, texto) {
  document.getElementById(id).textContent = texto;
}

function formatarHoras(horas) {
  return String(Math.round(horas * 10) / 10).replace(".", ",") + " h";
}

// 11451999 -> { valor: "11,5", unidade: "milhões" }; 487000 -> { valor: "487", unidade: "mil" }
function partesDoNumero(numero) {
  if (numero < 1e6) return { valor: Math.round(numero / 1000).toLocaleString("pt-BR"), unidade: "mil" };
  const milhoes = numero / 1e6;
  return {
    valor: milhoes.toLocaleString("pt-BR", { maximumFractionDigits: 1 }),
    unidade: milhoes < 2 ? "milhão" : "milhões"
  };
}

function emMilhoes(numero) {
  const partes = partesDoNumero(numero);
  return partes.valor + " " + partes.unidade;
}

// Número grande com a unidade menor ao lado, para caber numa linha do cartão
function escreverMilhoes(id, numero) {
  const partes = partesDoNumero(numero);
  document.getElementById(id).innerHTML = `${partes.valor} <span class="kpi-unidade">${partes.unidade}</span>`;
}

function porcentagem(parte, total) {
  return Math.round(parte / total * 100) + "%";
}

function somaMoradores(bairros) {
  return bairros.reduce((soma, bairro) => soma + bairro.populacaoEstimada, 0);
}

// Barra dividida em partes coloridas; "total" é o valor da barra inteira
function barraSvg(partes, total, descricao, classeExtra = "") {
  let x = 0;
  let retangulos = "";
  for (const parte of partes) {
    if (parte.valor === 0) continue;
    const largura = parte.valor / total * 100;
    retangulos += `<rect class="${parte.classe}" x="${x}" y="0" width="${largura}" height="10"></rect>`;
    x += largura;
  }
  return `<svg class="barra-svg ${classeExtra}" viewBox="0 0 100 10" preserveAspectRatio="none" role="img" aria-label="${descricao}">
      <rect class="barra-fundo" x="0" y="0" width="100" height="10"></rect>${retangulos}
    </svg>`;
}

// ---------- Números da lista de bairros ----------

const totalMoradores = somaMoradores(BAIRROS);
const bairrosRiscoAlto = BAIRROS.filter(bairro => bairro.vulnerabilidade === 3);
const moradoresRiscoAlto = somaMoradores(bairrosRiscoAlto);

escrever("ind-bairros", BAIRROS.length);
escreverMilhoes("ind-populacao", totalMoradores);
escrever("ind-populacao-nota", totalMoradores.toLocaleString("pt-BR") + " pelo Censo 2022 (Prefeitura de SP)");
escreverMilhoes("ind-pop-alta", moradoresRiscoAlto);
escrever("ind-pop-alta-nota", porcentagem(moradoresRiscoAlto, totalMoradores) + " dos moradores da capital");
escrever("ind-alta", bairrosRiscoAlto.length);
escrever("ind-alta-nota", "de " + BAIRROS.length + " bairros");
// Só os Centros Esportivos que são o mais próximo de algum bairro (um da base não é de nenhum)
escrever("ind-apoio", new Set(BAIRROS.map(bairro => bairro.abrigoId)).size);

// ---------- Onde está o risco ----------

// Uma barra por região; a região com mais bairros ocupa a largura toda
const maiorRegiao = Math.max(...REGIOES.map(regiao => BAIRROS.filter(bairro => bairro.regiao === regiao).length));
document.getElementById("grafico-regioes").innerHTML = REGIOES.map(function (regiao) {
  const daRegiao = BAIRROS.filter(bairro => bairro.regiao === regiao);
  const partes = RISCOS.map(risco => ({
    classe: risco.classe,
    nome: risco.nome,
    valor: daRegiao.filter(bairro => bairro.vulnerabilidade === risco.nivel).length
  }));
  const detalhe = `${partes[0].valor} de risco alto, ${partes[1].valor} médio e ${partes[2].valor} baixo`;
  return `
    <li class="barra-linha">
      <span class="barra-cabecalho">${nomeDaRegiao(regiao)} <span class="barra-total">${daRegiao.length} bairros</span></span>
      ${barraSvg(partes, maiorRegiao, nomeDaRegiao(regiao) + ": " + detalhe)}
      <span class="barra-detalhe">${detalhe}</span>
    </li>`;
}).join("");

// Uma barra só, dividida pelos moradores de cada nível de risco
const partesMoradores = RISCOS.map(risco => ({
  classe: risco.classe,
  nome: risco.nome,
  valor: somaMoradores(BAIRROS.filter(bairro => bairro.vulnerabilidade === risco.nivel))
}));
const pctAlto = Math.round(moradoresRiscoAlto / totalMoradores * 100);
escrever("frase-moradores", (pctAlto > 50 ? `Mais da metade (${pctAlto}%)` : `${pctAlto}%`) +
  " dos moradores da capital mora em bairros classificados como de risco alto.");
const descricaoMoradores = "Moradores por risco do bairro: " + partesMoradores
  .map(parte => `risco ${parte.nome}, ${emMilhoes(parte.valor)} (${porcentagem(parte.valor, totalMoradores)})`)
  .join("; ");
document.getElementById("grafico-moradores").innerHTML =
  barraSvg(partesMoradores, totalMoradores, descricaoMoradores, "barra-grossa") +
  `<ul class="barra-legenda">${partesMoradores.map(parte => `
    <li>
      <span class="amostra amostra-${parte.classe}"></span>
      <strong>${porcentagem(parte.valor, totalMoradores)}</strong> em bairros de risco ${parte.nome}
      <span class="barra-total">${emMilhoes(parte.valor)}</span>
    </li>`).join("")}
  </ul>`;

// ---------- Uso do protótipo (muda em outras páginas) ----------

function mostrarCadastrosEAlertas() {
  const comCadastro = BAIRROS
    .map(bairro => ({ bairro: bairro, total: estado.cadastros[bairro.id] || 0 }))
    .filter(item => item.total > 0)
    .sort((a, b) => b.total - a.total);
  escrever("ind-cadastros", comCadastro.reduce((soma, item) => soma + item.total, 0));

  const grafico = document.getElementById("grafico-cadastros");
  if (comCadastro.length === 0) {
    grafico.innerHTML = `<p class="sem-resultado">Nenhum cadastro feito ainda. <a href="cadastro.html">Cadastre o seu bairro</a> para ele aparecer aqui.</p>`;
  } else {
    const maior = comCadastro[0].total;
    grafico.innerHTML = `<ul class="barras">${comCadastro.slice(0, 10).map(item => `
      <li class="barra-linha">
        <span class="barra-cabecalho">${item.bairro.nome} <span class="barra-total">${item.total} cadastro(s)</span></span>
        ${barraSvg([{ classe: "barra-cadastro", valor: item.total }], maior, item.bairro.nome + ": " + item.total + " cadastro(s)")}
      </li>`).join("")}
    </ul>`;
  }
  atualizarLinks();   // estado.js: o link do cadastro também leva o estado

  escrever("ind-alertas", estado.alertas);
  document.getElementById("ind-antecedencia").classList.toggle("numero-vazio", estado.alertasComPrevisao === 0);
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
