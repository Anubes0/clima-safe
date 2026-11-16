// estado.js — o que precisa passar de uma página para outra:
// o tamanho do texto e os números da página Impacto (cadastros e alertas).
//
// Por que não basta o localStorage? Quando o site é aberto direto do arquivo (duplo clique),
// alguns navegadores, como o Firefox, dão um armazenamento separado para cada página.
// Por isso o estado também viaja no endereço dos links, por exemplo:
//   impacto.html?fonte=2&cadastros=5:1,3:2&alertas=4&antecedencia=30:2&atualizado=1763318400000

const estado = {
  fonte: 1,               // 0 = pequena, 1 = normal, 2 = grande, 3 = maior
  cadastros: {},          // id do bairro -> quantidade de cadastros
  alertas: 0,             // alertas amarelo ou mais
  horasAntecedencia: 0,   // soma das horas de antecedência (só previsão real)
  alertasComPrevisao: 0,  // quantos alertas entraram nessa soma
  atualizado: 0           // hora da última mudança; serve para saber qual estado é o mais novo
};

const funcoesQuandoMudar = [];   // o que cada página redesenha quando o estado muda

// ---------- Estado <-> texto ("fonte=2&cadastros=5:1,3:2&...") ----------

function estadoComoTexto() {
  const cadastros = Object.keys(estado.cadastros)
    .map(id => id + ":" + estado.cadastros[id])
    .join(",");
  return "fonte=" + estado.fonte +
    "&cadastros=" + cadastros +
    "&alertas=" + estado.alertas +
    "&antecedencia=" + estado.horasAntecedencia + ":" + estado.alertasComPrevisao +
    "&atualizado=" + estado.atualizado;
}

// Lê um texto no formato acima. Devolve null se o texto não tiver estado.
function lerTexto(texto) {
  const partes = new URLSearchParams(texto || "");
  if (!partes.has("atualizado")) return null;

  const lido = { cadastros: {} };
  lido.fonte = Number(partes.get("fonte"));
  lido.alertas = Number(partes.get("alertas"));
  lido.atualizado = Number(partes.get("atualizado"));

  const antecedencia = (partes.get("antecedencia") || "0:0").split(":");
  lido.horasAntecedencia = Number(antecedencia[0]);
  lido.alertasComPrevisao = Number(antecedencia[1]);

  const cadastros = partes.get("cadastros");
  if (cadastros) {
    for (const par of cadastros.split(",")) {
      const [id, quantidade] = par.split(":");
      lido.cadastros[id] = Number(quantidade);
    }
  }
  return lido;
}

// ---------- Guardar e carregar ----------

// O localStorage pode não existir (por exemplo, no Safari com o arquivo aberto do disco)
function lerDoNavegador() {
  try {
    return localStorage.getItem("climasafe-estado");
  } catch (erro) {
    return null;
  }
}

function guardarNoNavegador() {
  try {
    localStorage.setItem("climasafe-estado", estadoComoTexto());
  } catch (erro) {
    // sem localStorage: o estado continua viajando pelos links
  }
}

// Usa o estado mais novo entre o que veio no endereço da página e o guardado no navegador
function carregarEstado() {
  const doEndereco = lerTexto(location.search);
  const doNavegador = lerTexto(lerDoNavegador());
  let maisNovo = doEndereco;
  if (doNavegador && (!maisNovo || doNavegador.atualizado > maisNovo.atualizado)) {
    maisNovo = doNavegador;
  }
  if (maisNovo) Object.assign(estado, maisNovo);
}

// Coloca o estado nos links para as outras páginas do site
function atualizarLinks() {
  if (estado.atualizado === 0) return;   // nada mudou ainda: os links ficam limpos
  for (const link of document.querySelectorAll("a[href]")) {
    if (!link.dataset.destino) link.dataset.destino = link.getAttribute("href");
    const destino = link.dataset.destino;
    if (!destino.includes(".html") || destino.startsWith("http")) continue;   // só links internos
    const [pagina, ancora] = destino.split("#");
    link.href = pagina + "?" + estadoComoTexto() + (ancora ? "#" + ancora : "");
  }
}

// Toda página chama esta função depois de mudar o estado
function salvarEstado() {
  estado.atualizado = Date.now();
  guardarNoNavegador();
  atualizarLinks();
}

function quandoEstadoMudar(funcao) {
  funcoesQuandoMudar.push(funcao);
}

function avisarMudanca() {
  carregarEstado();
  atualizarLinks();
  for (const funcao of funcoesQuandoMudar) funcao();
}

// Outra aba do site mudou o estado (funciona quando as páginas dividem o localStorage)
window.addEventListener("storage", function (evento) {
  if (evento.key === "climasafe-estado") avisarMudanca();
});

// Voltou para esta página pelo botão "Voltar" do navegador
window.addEventListener("pageshow", function (evento) {
  if (evento.persisted) avisarMudanca();
});

carregarEstado();
atualizarLinks();
