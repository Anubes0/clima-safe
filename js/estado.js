// Dados que passam de uma página para outra: texto, contraste, bairro ou cidade, cadastros e alertas.
// Ficam no localStorage e também nos links (?fonte=2&cadastros=...), porque alguns navegadores
// separam o localStorage de cada página quando o site é aberto direto do arquivo.
// Carregado no <head>: aplica o tamanho do texto e o contraste antes de a página aparecer.

const estado = {
  fonte: 1,               // 0 a 3 (pequena a maior)
  contraste: false,       // modo de alto contraste
  bairro: 0,              // id do bairro escolhido (0 = nenhum)
  municipio: 0,           // código do IBGE da cidade escolhida fora da capital (0 = nenhuma: vale o bairro)
  cadastros: {},          // id do bairro -> quantidade
  alertas: 0,             // alertas amarelo ou mais
  horasAntecedencia: 0,   // soma das horas (só previsão real)
  alertasComPrevisao: 0,  // alertas que entraram na soma
  atualizado: 0           // hora da última mudança (vale o mais novo)
};

const funcoesQuandoMudar = [];   // redesenham a página quando o estado muda

// ---------- Estado <-> texto ----------

function estadoComoTexto() {
  const cadastros = Object.keys(estado.cadastros)
    .map(id => id + ":" + estado.cadastros[id])
    .join(",");
  return "fonte=" + estado.fonte +
    "&contraste=" + (estado.contraste ? 1 : 0) +
    "&bairro=" + estado.bairro +
    "&municipio=" + estado.municipio +
    "&cadastros=" + cadastros +
    "&alertas=" + estado.alertas +
    "&antecedencia=" + estado.horasAntecedencia + ":" + estado.alertasComPrevisao +
    "&atualizado=" + estado.atualizado;
}

// Devolve null se o texto não tiver estado
function lerTexto(texto) {
  const partes = new URLSearchParams(texto || "");
  if (!partes.has("atualizado")) return null;

  const lido = { cadastros: {} };
  lido.fonte = Number(partes.get("fonte"));
  lido.contraste = partes.get("contraste") === "1";
  lido.bairro = Number(partes.get("bairro")) || 0;
  lido.municipio = Number(partes.get("municipio")) || 0;
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

// O localStorage pode falhar (ex.: Safari com o arquivo local)
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
    // sem localStorage: o estado segue pelos links
  }
}

// Usa o mais novo: o do endereço ou o do navegador
function carregarEstado() {
  const doEndereco = lerTexto(location.search);
  const doNavegador = lerTexto(lerDoNavegador());
  let maisNovo = doEndereco;
  if (doNavegador && (!maisNovo || doNavegador.atualizado > maisNovo.atualizado)) {
    maisNovo = doNavegador;
  }
  if (maisNovo) Object.assign(estado, maisNovo);
}

// Põe o estado nos links internos
function atualizarLinks() {
  if (estado.atualizado === 0) return;   // nada mudou: links limpos
  for (const link of document.querySelectorAll("a[href]")) {
    if (!link.dataset.destino) link.dataset.destino = link.getAttribute("href");
    const destino = link.dataset.destino;
    if (!destino.includes(".html") || destino.startsWith("http")) continue;   // só links internos
    const [pagina, ancora] = destino.split("#");
    link.href = pagina + "?" + estadoComoTexto() + (ancora ? "#" + ancora : "");
  }
}

// Chamar depois de mudar o estado
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

// Outra aba mudou o estado
window.addEventListener("storage", function (evento) {
  if (evento.key === "climasafe-estado") avisarMudanca();
});

// Voltou pelo botão "Voltar" do navegador
window.addEventListener("pageshow", function (evento) {
  if (evento.persisted) avisarMudanca();
});

// Tamanhos do texto (botões A- e A+, em fonte.js); estado.fonte é a posição aqui
const TAMANHOS = ["fonte-pequena", "fonte-normal", "fonte-grande", "fonte-maior"];

// Classes do <html>: tamanho do texto, alto contraste e "js" (com JavaScript, o menu do celular
// começa fechado). Rodam no <head>, antes de a página aparecer: assim ela não pisca no estilo padrão.
function aplicarClassesDeLeitura() {
  const raiz = document.documentElement;
  raiz.classList.add("js");
  raiz.classList.remove(...TAMANHOS);
  raiz.classList.add(TAMANHOS[estado.fonte] || "fonte-normal");
  raiz.classList.toggle("alto-contraste", estado.contraste);
}

carregarEstado();
aplicarClassesDeLeitura();
// No <head> os links ainda não existem: são atualizados quando a página termina de carregar
document.addEventListener("DOMContentLoaded", atualizarLinks);
