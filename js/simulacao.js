// simulacao.js — calcula o alerta de cada bairro e mostra na página Solução.

const NIVEIS = ["verde", "amarelo", "laranja", "vermelho"];

// Texto de cada nível. A cor vem da classe CSS "alerta-<nível>".
const INFO_NIVEL = {
  verde: {
    nome: "Alerta verde",
    situacao: "sem alerta",
    oQueFazer: "Nada a fazer agora. Acompanhe a previsão."
  },
  amarelo: {
    nome: "Alerta amarelo",
    situacao: "perigo potencial",
    oQueFazer: "Evite áreas baixas e não deixe o carro em rua que costuma alagar."
  },
  laranja: {
    nome: "Alerta laranja",
    situacao: "perigo",
    oQueFazer: "Separe documentos e remédios e combine com a família onde se encontrar."
  },
  vermelho: {
    nome: "Alerta vermelho",
    situacao: "grande perigo",
    oQueFazer: "Vá para o ponto de apoio indicado. Em emergência, ligue 199 (Defesa Civil) ou 193 (Bombeiros)."
  }
};

const RISCO_DO_BAIRRO = { 1: "baixo", 2: "médio", 3: "alto" };

// Estado da tela
let modo = "simulacao";        // "simulacao" ou "previsao"
let chuvaSimulada = 0;         // mm/h escolhido no controle
let previsoes = {};            // previsão real de cada bairro, pelo id
let bairroEscolhido = BAIRROS[0];
let filtros = { regiao: "todas", risco: "todos", nivel: "todos", ordem: "nome" };

// ---------- Regras do alerta ----------

// Faixas do INMET. No limite exato (30 mm/h ou 50 mm no dia) vale o nível mais alto.
function classificarChuva(mmHora, mmDia) {
  let nivelHora = "verde";
  if (mmHora > 60) nivelHora = "vermelho";
  else if (mmHora >= 30) nivelHora = "laranja";
  else if (mmHora >= 20) nivelHora = "amarelo";

  let nivelDia = "verde";
  if (mmDia > 100) nivelDia = "vermelho";
  else if (mmDia >= 50) nivelDia = "laranja";

  // Vale o mais grave dos dois
  return NIVEIS[Math.max(NIVEIS.indexOf(nivelHora), NIVEIS.indexOf(nivelDia))];
}

// Bairro com risco alto sobe um nível; com risco baixo, desce um.
// Sem chuva forte (verde), não muda: não existe alerta sem chuva.
function ajustarPorVulnerabilidade(nivel, vulnerabilidade) {
  if (nivel === "verde") return "verde";
  let posicao = NIVEIS.indexOf(nivel);
  if (vulnerabilidade === 3 && posicao < 3) posicao++;
  if (vulnerabilidade === 1) posicao--;
  return NIVEIS[posicao];
}

// Chuva usada para o bairro: a do controle (simulação) ou a da previsão real
function chuvaDoBairro(bairro) {
  if (modo === "simulacao") {
    return { mmHoraMax: chuvaSimulada, mmDia: 0, horaPico: null, horasAtePico: null };
  }
  return previsoes[bairro.id] || null;
}

function nivelDoBairro(bairro) {
  const chuva = chuvaDoBairro(bairro);
  if (!chuva) return null;   // previsão indisponível
  const nivel = classificarChuva(chuva.mmHoraMax, chuva.mmDia);
  return ajustarPorVulnerabilidade(nivel, bairro.vulnerabilidade);
}

function filtrarPorNivel(nivel) {
  if (nivel === "todos") return BAIRROS;
  return BAIRROS.filter(bairro => nivelDoBairro(bairro) === nivel);
}

// Aplica os filtros da seção Bairros (região, risco e nível) e a ordem escolhida
function bairrosFiltrados() {
  let lista = filtrarPorNivel(filtros.nivel);
  if (filtros.regiao !== "todas") lista = lista.filter(bairro => bairro.regiao === filtros.regiao);
  if (filtros.risco !== "todos") lista = lista.filter(bairro => bairro.vulnerabilidade === Number(filtros.risco));

  lista = lista.slice();   // cópia, para não mudar a ordem da lista original
  if (filtros.ordem === "nome") {
    lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  } else if (filtros.ordem === "risco") {
    lista.sort((a, b) => b.vulnerabilidade - a.vulnerabilidade || a.nome.localeCompare(b.nome, "pt-BR"));
  } else if (filtros.ordem === "moradores") {
    lista.sort((a, b) => b.populacaoEstimada - a.populacaoEstimada);
  } else if (filtros.ordem === "alerta") {
    const gravidade = bairro => NIVEIS.indexOf(nivelDoBairro(bairro));
    lista.sort((a, b) => gravidade(b) - gravidade(a) || a.nome.localeCompare(b.nome, "pt-BR"));
  }
  return lista;
}

// Tira acentos e maiúsculas, para "sao" achar "São Miguel"
function semAcento(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// ---------- Textos ----------

function formatarMm(valor) {
  return String(Math.round(valor * 10) / 10).replace(".", ",");
}

// Selo do nível. A cor nunca aparece sozinha: o nível também vai escrito.
function seloDoNivel(nivel) {
  if (!nivel) return `<span class="selo alerta-indisponivel">Previsão indisponível</span>`;
  const info = INFO_NIVEL[nivel];
  return `<span class="selo alerta-${nivel}">${info.nome} (${info.situacao})</span>`;
}

function textoDaChuva(chuva) {
  if (modo === "simulacao") {
    return formatarMm(chuva.mmHoraMax) + " mm/h (chuva simulada)";
  }
  let texto = "até " + formatarMm(chuva.mmHoraMax) + " mm/h nas próximas 24 h";
  if (chuva.horaPico) texto += ", com pico às " + Number(chuva.horaPico.slice(11, 13)) + "h";
  return texto + ". Total previsto para hoje: " + formatarMm(chuva.mmDia) + " mm";
}

// ---------- Tela ----------

function renderizarResultado(bairro) {
  const painel = document.getElementById("painel-resultado");
  const nivel = nivelDoBairro(bairro);
  const chuva = chuvaDoBairro(bairro);
  const abrigo = buscarAbrigo(bairro);

  painel.className = "painel alerta-" + (nivel || "indisponivel");
  if (!nivel) {
    painel.innerHTML = `
      <h3>${bairro.nome}</h3>
      ${seloDoNivel(null)}
      <p>Sem previsão para este bairro agora. Use a chuva simulada.</p>`;
    return;
  }

  let risco = "Risco do bairro: " + RISCO_DO_BAIRRO[bairro.vulnerabilidade] + ".";
  const nivelSoDaChuva = classificarChuva(chuva.mmHoraMax, chuva.mmDia);
  if (nivelSoDaChuva !== nivel) {
    risco += ` Só pela chuva o alerta seria ${nivelSoDaChuva}; pelo risco do bairro, passou para ${nivel}.`;
  }
  const telefone = abrigo.telefone ? " · Tel. " + abrigo.telefone : "";

  painel.innerHTML = `
    <h3>${bairro.nome}</h3>
    <p class="regiao-bairro">${nomeDaRegiao(bairro.regiao)} · Subprefeitura ${bairro.subprefeitura}</p>
    ${seloDoNivel(nivel)}
    <dl class="lista-dados">
      <dt>Chuva</dt><dd>${textoDaChuva(chuva)}</dd>
      <dt>Risco</dt><dd>${risco}</dd>
    </dl>
    <p class="recomendacao"><strong>O que fazer:</strong> ${INFO_NIVEL[nivel].oQueFazer}</p>
    <div class="caixa-abrigo">
      <h4>Ponto de apoio mais próximo</h4>
      <p>${abrigo.nome}, a ${formatarMm(bairro.distanciaAbrigoKm)} km do centro do bairro</p>
      <p>${abrigo.endereco}${telefone}</p>
      <p class="aviso">É um equipamento público da Prefeitura, não um abrigo oficial. Antes de sair, confirme com a Defesa Civil (199).</p>
    </div>`;
}

function htmlDoCard(bairro) {
  const abrigo = buscarAbrigo(bairro);
  const escolhido = bairro.id === bairroEscolhido.id ? " selecionado" : "";
  const fontes = bairro.fontes
    .map(fonte => `<a href="${fonte.url}" target="_blank" rel="noopener">${fonte.rotulo}</a>`)
    .join("; ");
  const noticia = bairro.noticia ? `<p class="historico">${bairro.noticia}</p>` : "";

  return `
    <li class="card${escolhido}">
      <h4>${bairro.nome}</h4>
      <p class="regiao-bairro">${nomeDaRegiao(bairro.regiao)} · Subprefeitura ${bairro.subprefeitura}</p>
      ${seloDoNivel(nivelDoBairro(bairro))}
      <p class="historico">${bairro.historico}</p>
      ${noticia}
      <dl class="lista-dados">
        <dt>Risco do bairro</dt><dd>${RISCO_DO_BAIRRO[bairro.vulnerabilidade]}</dd>
        <dt>Moradores</dt><dd>${bairro.populacaoEstimada.toLocaleString("pt-BR")}</dd>
        <dt>Ponto de apoio</dt><dd>${abrigo.nome} (${formatarMm(bairro.distanciaAbrigoKm)} km)</dd>
      </dl>
      <p class="fontes-card">Fonte: ${fontes}</p>
      <button type="button" class="botao botao-secundario" data-id="${bairro.id}"
        aria-label="Ver ${bairro.nome} no painel">Ver no painel</button>
    </li>`;
}

// Mostra os cards separados por região: um título e uma grade de cards para cada uma
function renderizarCards(lista) {
  let html = "";
  for (const regiao of REGIOES) {
    const daRegiao = lista.filter(bairro => bairro.regiao === regiao);
    if (daRegiao.length === 0) continue;
    html += `
      <section class="grupo-regiao" aria-label="${nomeDaRegiao(regiao)}">
        <h3>${nomeDaRegiao(regiao)} <span class="contagem-regiao">${daRegiao.length} bairro(s)</span></h3>
        <ul class="grade-bairros">${daRegiao.map(htmlDoCard).join("")}</ul>
      </section>`;
  }
  if (html === "") html = `<p class="sem-resultado">Nenhum bairro com esses filtros.</p>`;
  document.getElementById("lista-bairros").innerHTML = html;
  document.getElementById("contagem-bairros").textContent =
    "Mostrando " + lista.length + " de " + BAIRROS.length + " bairros.";
}

function atualizarTela() {
  renderizarResultado(bairroEscolhido);
  renderizarCards(bairrosFiltrados());
  atualizarCoresDoMapa();   // mapa.js
}

// Escolhe um bairro (pelo seletor, pela busca, pelos cards ou pelo mapa).
// Na busca, "contarAlerta" é false: digitar não pode contar um alerta a cada letra.
function escolherBairro(id, contarAlerta = true) {
  bairroEscolhido = buscarBairro(id);
  selectBairro.value = bairroEscolhido.id;
  atualizarTela();
  if (contarAlerta) registrarAlerta(bairroEscolhido);
}

// Conta os alertas (amarelo ou mais) para os indicadores da página Impacto (estado.js)
function registrarAlerta(bairro) {
  const nivel = nivelDoBairro(bairro);
  if (!nivel || nivel === "verde") return;
  estado.alertas++;
  // Com a previsão real dá para saber quantas horas antes do pico da chuva o alerta saiu
  if (modo === "previsao") {
    estado.horasAntecedencia += chuvaDoBairro(bairro).horasAtePico;
    estado.alertasComPrevisao++;
  }
  salvarEstado();
}

let esperandoPrevisao = false;

function avisarFalhaNaPrevisao() {
  const status = document.getElementById("status-previsao");
  status.className = "status erro";
  status.textContent = "Não foi possível obter a previsão agora. Use o simulador abaixo.";
}

// Botão "Buscar previsão real": uma só chamada para os bairros e os municípios do mapa
async function buscarPrevisaoReal() {
  const botao = document.getElementById("btn-buscar");
  const status = document.getElementById("status-previsao");
  botao.disabled = true;
  status.className = "status";
  status.textContent = "Buscando a previsão…";
  esperandoPrevisao = true;

  // Se a resposta demorar mais de 10 segundos, avisa e libera o botão
  setTimeout(function () {
    if (esperandoPrevisao) {
      esperandoPrevisao = false;
      avisarFalhaNaPrevisao();
      botao.disabled = false;
    }
  }, 10000);

  try {
    const resultado = await buscarPrevisao(BAIRROS.concat(OUTROS_MUNICIPIOS));
    if (!esperandoPrevisao) return;   // chegou depois do tempo limite: ignora
    previsoes = {};
    BAIRROS.forEach((bairro, i) => previsoes[bairro.id] = resultado[i]);
    previsoesMunicipios = resultado.slice(BAIRROS.length);   // usado pelo mapa (mapa.js)
    modo = "previsao";
    status.textContent = "Previsão real carregada (Open-Meteo). Para testar outros cenários, mexa no controle de chuva.";
    registrarAlerta(bairroEscolhido);
  } catch (erro) {
    if (!esperandoPrevisao) return;
    avisarFalhaNaPrevisao();
  }

  esperandoPrevisao = false;
  botao.disabled = false;
  atualizarTela();
}

// ---------- Eventos ----------

const selectBairro = document.getElementById("select-bairro");
const buscaBairro = document.getElementById("busca-bairro");
const faixaChuva = document.getElementById("faixa-chuva");
preencherSelectBairros(selectBairro);

selectBairro.addEventListener("change", function () {
  escolherBairro(selectBairro.value);
});

// Busca por escrito: o seletor passa a mostrar só os bairros que combinam com o texto
// e o primeiro deles já fica escolhido
buscaBairro.addEventListener("input", function () {
  const texto = semAcento(buscaBairro.value.trim());
  const encontrados = BAIRROS.filter(bairro => semAcento(bairro.nome).includes(texto));
  const aviso = document.getElementById("aviso-busca");

  if (encontrados.length === 0) {
    aviso.textContent = "Nenhum bairro com esse nome. Confira a escrita ou escolha no mapa.";
    return;
  }
  aviso.textContent = texto === "" ? "" : encontrados.length + " bairro(s) encontrado(s).";
  preencherSelectBairros(selectBairro, encontrados);
  const continuaNaLista = encontrados.some(bairro => bairro.id === bairroEscolhido.id);
  escolherBairro(continuaNaLista ? bairroEscolhido.id : encontrados[0].id, false);
});

faixaChuva.addEventListener("input", function () {
  modo = "simulacao";
  chuvaSimulada = Number(faixaChuva.value);
  document.getElementById("valor-chuva").textContent = chuvaSimulada + " mm/h";
  faixaChuva.setAttribute("aria-valuetext", chuvaSimulada + " milímetros por hora");
  document.getElementById("status-previsao").textContent = "";
  atualizarTela();
});

// O alerta só é contado quando a pessoa solta o controle, não a cada passo
faixaChuva.addEventListener("change", function () {
  registrarAlerta(bairroEscolhido);
});

document.getElementById("btn-buscar").addEventListener("click", buscarPrevisaoReal);

// Filtros da seção Bairros: cada <select> guarda o valor no objeto "filtros"
for (const nome of ["regiao", "risco", "nivel", "ordem"]) {
  document.getElementById("filtro-" + nome).addEventListener("change", function () {
    filtros[nome] = this.value;
    renderizarCards(bairrosFiltrados());
  });
}

// Botões "Ver no painel" dos cards: um ouvinte só para a lista toda
document.getElementById("lista-bairros").addEventListener("click", function (evento) {
  const id = evento.target.getAttribute("data-id");
  if (!id) return;
  escolherBairro(id);
  document.getElementById("painel-resultado").scrollIntoView({ block: "nearest" });
});

selectBairro.value = bairroEscolhido.id;
atualizarTela();
