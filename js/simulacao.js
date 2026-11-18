// Regra do alerta, painel e cards.
// Solução: previsão real (<body data-modo="previsao">). Simulador: chuva do controle.

const NIVEIS = ["verde", "amarelo", "laranja", "vermelho"];

// A cor vem da classe CSS "alerta-<nível>"
const INFO_NIVEL = {
  verde: {
    nome: "Alerta verde",
    situacao: "sem alerta",
    oQueFazer: "Nada a fazer agora. Acompanhe a previsão.",
    cuidados: [
      "Acompanhe a previsão e os avisos da Defesa Civil.",
      "Mantenha calhas, ralos e bueiros perto de casa sem lixo.",
      "Deixe à mão documentos, remédios, lanterna e carregador de celular."
    ]
  },
  amarelo: {
    nome: "Alerta amarelo",
    situacao: "perigo potencial",
    oQueFazer: "Evite áreas baixas e não deixe o carro em rua que costuma alagar.",
    cuidados: [
      "Evite áreas baixas e não deixe o carro em rua que costuma alagar.",
      "Tire do chão objetos de valor, eletrônicos e documentos.",
      "Guarde documentos e remédios num saco plástico fechado.",
      "Fique atento a raios e ventos fortes."
    ]
  },
  laranja: {
    nome: "Alerta laranja",
    situacao: "perigo",
    oQueFazer: "Separe documentos e remédios e combine com a família onde se encontrar.",
    cuidados: [
      "Separe documentos e remédios e combine com a família onde se encontrar.",
      "Evite sair; se precisar, não passe por ruas alagadas.",
      "Com ventos fortes, fique longe de árvores, postes e placas.",
      "Se a água começar a entrar, desligue os aparelhos da tomada."
    ]
  },
  vermelho: {
    nome: "Alerta vermelho",
    situacao: "grande perigo",
    oQueFazer: "Vá para o ponto de apoio indicado. Em emergência, ligue 199 (Defesa Civil) ou 193 (Bombeiros).",
    cuidados: [
      "Vá para o ponto de apoio indicado ou para um lugar alto e seguro.",
      "Não fique na rua: procure abrigo por causa dos ventos fortes, raios e alagamentos.",
      "Nunca atravesse ruas, córregos ou pontes alagadas, a pé ou de carro.",
      "Se a água entrar em casa, desligue a energia e o gás.",
      "Evite contato com a água da enchente: ela pode transmitir doenças, como a leptospirose.",
      "Em emergência, ligue 199 (Defesa Civil) ou 193 (Bombeiros)."
    ]
  }
};

const RISCO_DO_BAIRRO = { 1: "baixo", 2: "médio", 3: "alto" };

// Estado da tela
let modo = document.body.dataset.modo === "previsao" ? "previsao" : "simulacao";
let chuvaSimulada = 0;         // mm/h do controle
let previsoes = {};            // previsão real por id do bairro
let bairroEscolhido = buscarBairro(estado.bairro) || BAIRROS[0];   // volta ao último escolhido
// Cidade escolhida fora da capital (posição em OUTROS_MUNICIPIOS, mapa.js); null = vale o bairro
let municipioEscolhido = cidadeDoEstado();
let filtros = { regiao: "todas", risco: "todos", nivel: "todos", ordem: "nome" };

// Posição da cidade guardada no estado (pelo código do IBGE); null se não houver
function cidadeDoEstado() {
  const posicao = OUTROS_MUNICIPIOS.findIndex(municipio => municipio.id === estado.municipio);
  return posicao === -1 ? null : posicao;
}

// ---------- Regras do alerta ----------

// Faixas do INMET: 20, 30 e 50 já contam no nível de cima; 60 mm/h e 100 mm ainda são laranja
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

// Risco alto sobe um nível, risco baixo desce. Sem chuva forte (verde), não muda.
function ajustarPorVulnerabilidade(nivel, vulnerabilidade) {
  if (nivel === "verde") return "verde";
  let posicao = NIVEIS.indexOf(nivel);
  if (vulnerabilidade === 3 && posicao < 3) posicao++;
  if (vulnerabilidade === 1) posicao--;
  return NIVEIS[posicao];
}

// Chuva do controle (simulação) ou da previsão real
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

// Filtros e ordem da seção Bairros
function bairrosFiltrados() {
  let lista = filtrarPorNivel(filtros.nivel);
  if (filtros.regiao !== "todas") lista = lista.filter(bairro => bairro.regiao === filtros.regiao);
  if (filtros.risco !== "todos") lista = lista.filter(bairro => bairro.vulnerabilidade === Number(filtros.risco));

  lista = lista.slice();   // cópia: não muda a lista original
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

// ---------- Textos ----------

function formatarMm(valor) {
  return String(Math.round(valor * 10) / 10).replace(".", ",");
}

// Sem nível: a previsão ainda está chegando (Solução) ou não veio
function textoSemPrevisao() {
  return esperandoPrevisao ? "Buscando a previsão…" : "Previsão indisponível";
}

// A cor nunca aparece sozinha: o nível vai escrito
function seloDoNivel(nivel) {
  if (!nivel) return `<span class="selo alerta-indisponivel">${textoSemPrevisao()}</span>`;
  const info = INFO_NIVEL[nivel];
  return `<span class="selo alerta-${nivel}">${info.nome} (${info.situacao})</span>`;
}

// "2026-11-18T15:00" -> "das 15h às 16h" (a chuva de uma hora vai do começo ao fim dela)
function faixaDeHorario(hora) {
  const inicio = Number(hora.slice(11, 13));
  return "das " + inicio + "h às " + (inicio + 1) % 24 + "h";
}

function textoDaChuva(chuva) {
  if (modo === "simulacao") {
    return formatarMm(chuva.mmHoraMax) + " mm/h (chuva simulada)";
  }
  let texto = "até " + formatarMm(chuva.mmHoraMax) + " mm/h nas próximas 24 h";
  if (chuva.horaPico) texto += ", com pico " + faixaDeHorario(chuva.horaPico);
  return texto + ". Total previsto em 24 h: " + formatarMm(chuva.mmDia) + " mm";
}

// Barras da chuva hora a hora (só com a previsão real). Escala de pelo menos 25 mm/h,
// para chuva fraca não parecer forte; a linha tracejada marca 20 mm/h (início do amarelo).
function graficoDaChuva(chuva) {
  if (modo !== "previsao" || !chuva.proximasChuvas) {
    return `<p class="nota grafico-aviso">O gráfico da chuva hora a hora e os próximos 7 dias aparecem com a previsão real, na página <a href="solucao.html">Solução</a>.</p>`;
  }
  const escalaMax = Math.max(25, chuva.mmHoraMax * 1.15);
  const altura = mm => mm / escalaMax * 100;
  let barras = "";
  chuva.proximasChuvas.forEach(function (mm, i) {
    if (mm <= 0) return;
    const h = Math.max(1.5, altura(mm));
    const pico = i === chuva.horasAtePico ? " barra-pico" : "";
    barras += `<rect class="barra mapa-alerta-${classificarChuva(mm, 0)}${pico}" x="${i * 10 + 1}" y="${100 - h}" width="8" height="${h}"></rect>`;
  });
  const marcas = [0, 6, 12, 18]
    .filter(i => chuva.proximasHoras[i])
    .map(i => `<span>${Number(chuva.proximasHoras[i].slice(11, 13))}h</span>`)
    .join("");
  const resumo = chuva.horaPico
    ? `Pico ${faixaDeHorario(chuva.horaPico)}, com ${formatarMm(chuva.mmHoraMax)} mm/h.`
    : "Sem chuva prevista nas próximas 24 horas.";
  return `
    <figure class="grafico-chuva">
      <figcaption>Chuva hora a hora (próximas 24 h)</figcaption>
      <svg viewBox="0 0 240 100" preserveAspectRatio="none" role="img" aria-label="Gráfico da chuva nas próximas 24 horas. ${resumo}">
        <line class="grafico-limite" x1="0" y1="${100 - altura(20)}" x2="240" y2="${100 - altura(20)}"></line>
        ${barras}
      </svg>
      <div class="grafico-eixo" aria-hidden="true">${marcas}</div>
      <p class="nota">${resumo} Linha tracejada: 20 mm/h, onde começa o alerta amarelo.</p>
    </figure>`;
}

// Lista do que fazer no nível; "quantos" limita os itens (cards da lista)
function listaDeCuidados(nivel, quantos) {
  const itens = INFO_NIVEL[nivel].cuidados.slice(0, quantos);
  return `<ul class="cuidados">${itens.map(item => `<li>${item}</li>`).join("")}</ul>`;
}

const ICONE_PINO = `<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>`;

// Rota no Google Maps até o ponto de apoio (só um link, sem API)
function linkComoChegar(abrigo) {
  return "https://www.google.com/maps/dir/?api=1&destination=" + abrigo.latitude + "," + abrigo.longitude;
}

// Mensagem pronta para o WhatsApp; a pessoa escolhe para quem enviar.
// lugar: "Penha, São Paulo"; apoio: frase sobre o ponto de apoio.
function linkWhatsApp(lugar, nivel, chuva, apoio) {
  const info = INFO_NIVEL[nivel];
  let texto = (modo === "simulacao" ? "SIMULAÇÃO (não é alerta real). " : "") +
    `${info.nome} (${info.situacao}) em ${lugar}. ` +
    `Chuva: ${textoDaChuva(chuva)}. O que fazer: ${info.oQueFazer} ${apoio} ` +
    (nivel === "vermelho" ? "" : "Emergência: Defesa Civil 199, Bombeiros 193. ") +   // o vermelho já cita
    "Enviado pelo Clima Safe.";
  if (location.protocol === "https:") texto += " " + location.origin + location.pathname;
  return "https://wa.me/?text=" + encodeURIComponent(texto);
}

// ---------- Tela ----------

// Painel sem nível: previsão chegando ou indisponível. oLugar: "este bairro" ou "esta cidade"
function painelSemPrevisao(painel, nome, oLugar) {
  const texto = esperandoPrevisao
    ? "A previsão real está sendo carregada."
    : `Sem previsão para ${oLugar} agora. Tente atualizar ou teste no <a href="simulador.html">Simulador</a>.`;
  painel.innerHTML = `
    <div class="painel-topo">
      <p class="painel-nivel">${textoSemPrevisao()}</p>
      <h3>${nome}</h3>
    </div>
    <div class="painel-corpo"><p>${texto}</p></div>`;
}

function renderizarResultado(bairro) {
  const painel = document.getElementById("painel-resultado");
  const nivel = nivelDoBairro(bairro);
  const chuva = chuvaDoBairro(bairro);
  const abrigo = buscarAbrigo(bairro);

  painel.className = "painel alerta-" + (nivel || "indisponivel");
  if (!nivel) {
    painelSemPrevisao(painel, bairro.nome, "este bairro");
    return;
  }

  let risco = "Risco do bairro: " + RISCO_DO_BAIRRO[bairro.vulnerabilidade] + ".";
  const nivelSoDaChuva = classificarChuva(chuva.mmHoraMax, chuva.mmDia);
  if (nivelSoDaChuva !== nivel) {
    risco += ` Só pela chuva o alerta seria ${nivelSoDaChuva}; pelo risco do bairro, passou para ${nivel}.`;
  }
  const telefone = abrigo.telefone ? " · Tel. " + abrigo.telefone : "";
  const apoio = `Ponto de apoio: ${abrigo.nome}, ${abrigo.endereco} (confirme com a Defesa Civil).`;

  painel.innerHTML = `
    <div class="painel-topo">
      <p class="painel-nivel">${INFO_NIVEL[nivel].nome} (${INFO_NIVEL[nivel].situacao})</p>
      <h3>${bairro.nome}</h3>
      <p class="regiao-bairro">${nomeDaRegiao(bairro.regiao)} · Subprefeitura ${bairro.subprefeitura}</p>
    </div>
    <div class="painel-corpo">
    <dl class="lista-dados">
      <dt>Chuva</dt><dd>${textoDaChuva(chuva)}</dd>
      <dt>Risco</dt><dd>${risco}</dd>
    </dl>
    ${graficoDaChuva(chuva)}
    <div class="recomendacao">
      <h4>O que fazer</h4>
      ${listaDeCuidados(nivel)}
    </div>
    <div class="caixa-abrigo">
      <h4>Ponto de apoio mais próximo</h4>
      <p class="abrigo-nome">${abrigo.nome}</p>
      <p>${abrigo.endereco}${telefone}</p>
      <a class="botao botao-rota" href="${linkComoChegar(abrigo)}" target="_blank" rel="noopener">${ICONE_PINO} Como chegar (Google Maps)</a>
      <p class="aviso">É um equipamento público da Prefeitura, não um abrigo oficial. Antes de sair, confirme com a Defesa Civil (199).</p>
    </div>
    <p class="compartilhar">
      <a class="botao botao-secundario" href="cadastro.html">Receber alertas deste bairro</a>
      <a class="botao botao-secundario" href="${linkWhatsApp(bairro.nome + ", São Paulo", nivel, chuva, apoio)}" target="_blank" rel="noopener">Compartilhar no WhatsApp</a>
    </p>
    </div>`;
}

// Painel de uma cidade fora da capital: o nível vem só da chuva, e os pontos de apoio
// do site são só da cidade de São Paulo
function renderizarMunicipio(indice) {
  const painel = document.getElementById("painel-resultado");
  const municipio = OUTROS_MUNICIPIOS[indice];
  const nivel = nivelDoMunicipio(indice);   // mapa.js
  const chuva = chuvaDoMunicipio(indice);

  painel.className = "painel alerta-" + (nivel || "indisponivel");
  if (!nivel) {
    painelSemPrevisao(painel, municipio.nome, "esta cidade");
    return;
  }

  // Na simulação, cada cidade recebe um pouco mais ou menos que o controle (mapa.js)
  const variacao = modo === "simulacao" && chuvaSimulada > 0
    ? ". Fora da capital, ela varia um pouco de cidade para cidade"
    : "";

  painel.innerHTML = `
    <div class="painel-topo">
      <p class="painel-nivel">${INFO_NIVEL[nivel].nome} (${INFO_NIVEL[nivel].situacao})</p>
      <h3>${municipio.nome}</h3>
      <p class="regiao-bairro">Grande São Paulo · Sub-região ${municipio.subregiao}</p>
    </div>
    <div class="painel-corpo">
    <dl class="lista-dados">
      <dt>Chuva</dt><dd>${textoDaChuva(chuva)}${variacao}</dd>
      <dt>Risco</dt><dd>O risco de alagamento por bairro só existe para a capital. Aqui, o nível vem só da chuva.</dd>
    </dl>
    ${graficoDaChuva(chuva)}
    <div class="recomendacao">
      <h4>O que fazer</h4>
      ${listaDeCuidados(nivel)}
    </div>
    <div class="caixa-abrigo">
      <h4>Ponto de apoio</h4>
      <p>O Clima Safe indica pontos de apoio só na cidade de São Paulo. Em ${municipio.nome}, pergunte à Defesa Civil (199) para onde ir.</p>
    </div>
    <p class="compartilhar">
      <a class="botao botao-secundario" href="${linkWhatsApp(municipio.nome + ", Grande São Paulo", nivel, chuva, "Ponto de apoio: pergunte à Defesa Civil.")}" target="_blank" rel="noopener">Compartilhar no WhatsApp</a>
    </p>
    </div>`;
}

// Painel "Seu bairro": a cidade escolhida ou, sem ela, o bairro
function renderizarPainel() {
  if (municipioEscolhido !== null) renderizarMunicipio(municipioEscolhido);
  else renderizarResultado(bairroEscolhido);

  // Leitor de tela: o painel não é lido de novo a cada redesenho (seriam dezenas ao arrastar
  // a chuva). Só o lugar e o nível são avisados, e só quando mudam.
  const aviso = document.getElementById("aviso-painel");
  const texto = nomeDoLugarEscolhido() + ": " + document.querySelector("#painel-resultado .painel-nivel").textContent;
  if (aviso.textContent !== texto) aviso.textContent = texto;
}

// Conteúdo comum aos cards da lista e ao card em destaque.
// "quantosCuidados" limita a lista do que fazer (nos cards da lista, só os primeiros).
function conteudoDoCard(bairro, quantosCuidados) {
  const abrigo = buscarAbrigo(bairro);
  const nivel = nivelDoBairro(bairro);
  const cuidados = nivel
    ? `<p class="card-subtitulo">O que fazer</p>${listaDeCuidados(nivel, quantosCuidados)}`
    : "";
  const fontes = bairro.fontes
    .map(fonte => `<a href="${fonte.url}" target="_blank" rel="noopener">${fonte.rotulo}</a>`)
    .join("; ");
  const noticia = bairro.noticia ? `<p class="historico">${bairro.noticia}</p>` : "";

  return `
      <h4>${bairro.nome}</h4>
      <p class="regiao-bairro">${nomeDaRegiao(bairro.regiao)} · Subprefeitura ${bairro.subprefeitura}</p>
      ${seloDoNivel(nivel)}
      ${cuidados}
      <p class="historico">${bairro.historico}</p>
      ${noticia}
      <dl class="lista-dados">
        <dt>Risco do bairro</dt><dd>${RISCO_DO_BAIRRO[bairro.vulnerabilidade]}</dd>
        <dt>Moradores</dt><dd>${bairro.populacaoEstimada.toLocaleString("pt-BR")}</dd>
        <dt>Ponto de apoio</dt><dd>${abrigo.nome}</dd>
      </dl>
      <p class="fontes-card">Fonte: ${fontes}</p>`;
}

function htmlDoCard(bairro) {
  const escolhido = municipioEscolhido === null && bairro.id === bairroEscolhido.id ? " selecionado" : "";
  return `
    <li class="card${escolhido}">
      ${conteudoDoCard(bairro, 3)}
      <button type="button" class="botao botao-secundario" data-id="${bairro.id}"
        aria-label="Ver ${bairro.nome} no painel">Ver no painel</button>
    </li>`;
}

// O bairro escolhido fica em destaque no começo da seção Bairros
function renderizarDestaque() {
  const destaque = document.getElementById("bairro-destaque");
  if (!destaque) return;   // só na Solução
  destaque.hidden = municipioEscolhido !== null;   // cidade fora da capital: a seção é só de bairros
  if (destaque.hidden) return;
  destaque.innerHTML = `
    <h3>Bairro escolhido</h3>
    <article class="card card-destaque">
      ${conteudoDoCard(bairroEscolhido)}
      <a class="botao botao-secundario" href="#seu-bairro">Ver no painel</a>
    </article>`;
}

// Cards separados por região
function renderizarCards(lista) {
  if (!document.getElementById("lista-bairros")) return;   // só na Solução
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
  // É lido pelo leitor de tela: só troca quando a contagem muda
  const contagem = document.getElementById("contagem-bairros");
  const textoContagem = "Mostrando " + lista.length + " de " + BAIRROS.length + " bairros.";
  if (contagem.textContent !== textoContagem) contagem.textContent = textoContagem;
  const emAlerta = BAIRROS.filter(bairro => NIVEIS.indexOf(nivelDoBairro(bairro)) > 0).length;
  let resumo = emAlerta === 0 ? "nenhum em alerta" : emAlerta + " em alerta";
  if (BAIRROS.every(bairro => !nivelDoBairro(bairro))) resumo = textoSemPrevisao().toLowerCase();   // nenhuma previsão ainda
  document.getElementById("resumo-bairros").textContent = BAIRROS.length + " bairros · " + resumo;
}

function atualizarTela() {
  renderizarPainel();
  renderizarSemana();
  renderizarDestaque();
  renderizarCards(bairrosFiltrados());
  atualizarCoresDoMapa();   // mapa.js
  atualizarLinks();         // estado.js: os links novos do painel também levam o estado
}

// Chave e nome do lugar escolhido, para o campo (campo-bairro.js).
// Chave: "b" + id do bairro ou "m" + posição da cidade.
function chaveDoEscolhido() {
  return municipioEscolhido !== null ? "m" + municipioEscolhido : "b" + bairroEscolhido.id;
}

function nomeDoLugarEscolhido() {
  return municipioEscolhido !== null ? OUTROS_MUNICIPIOS[municipioEscolhido].nome : bairroEscolhido.nome;
}

// Chamada pelo campo, pelos cards, pelo mapa e pela localização
function escolherBairro(id) {
  bairroEscolhido = buscarBairro(id);
  municipioEscolhido = null;
  estado.bairro = bairroEscolhido.id;
  estado.municipio = 0;
  mostrarNoCampo(bairroEscolhido.nome);   // campo-bairro.js
  atualizarTela();
  registrarAlerta();
  salvarEstado();
}

// Cidade da Grande SP fora da capital (posição em OUTROS_MUNICIPIOS)
function escolherMunicipio(indice) {
  municipioEscolhido = indice;
  estado.municipio = OUTROS_MUNICIPIOS[indice].id;   // código do IBGE
  mostrarNoCampo(OUTROS_MUNICIPIOS[indice].nome);
  atualizarTela();
  registrarAlerta();
  salvarEstado();
}

// Conta alertas (amarelo ou mais) do lugar escolhido, para a página Impacto.
// Conta a mudança, não o clique: o mesmo lugar no mesmo nível não soma de novo
// (clique repetido, duplo clique do mapa, cada passo do controle pelo teclado).
let ultimoAlertaContado = "";   // "chave do lugar:nível"

function registrarAlerta() {
  const naCidade = municipioEscolhido !== null;
  const nivel = naCidade ? nivelDoMunicipio(municipioEscolhido) : nivelDoBairro(bairroEscolhido);
  if (!nivel || nivel === "verde") {
    ultimoAlertaContado = "";   // o alerta acabou: o próximo conta
    return;
  }
  const alerta = chaveDoEscolhido() + ":" + nivel;
  if (alerta === ultimoAlertaContado) return;
  ultimoAlertaContado = alerta;
  estado.alertas++;
  // Com previsão real, mede a antecedência até o pico da chuva
  if (modo === "previsao") {
    const chuva = naCidade ? chuvaDoMunicipio(municipioEscolhido) : chuvaDoBairro(bairroEscolhido);
    estado.horasAntecedencia += chuva.horasAtePico;
    estado.alertasComPrevisao++;
  }
  salvarEstado();
}

// ---------- Previsão real (só na Solução) ----------

let esperandoPrevisao = modo === "previsao";   // a Solução já abre buscando
let ultimaBusca = 0;                           // número da busca mais recente
const CHAVE_PREVISAO = "climasafe-previsao-2"; // "-2": a leitura da previsão mudou (api.js)
const VALIDADE_PREVISAO = 10 * 60 * 1000;      // 10 min: não repete a chamada a cada página

function previsaoGuardada() {
  try {
    const guardada = JSON.parse(sessionStorage.getItem(CHAVE_PREVISAO));
    if (guardada && Date.now() - guardada.hora < VALIDADE_PREVISAO) return guardada;
  } catch (erro) {
    // sem sessionStorage: busca de novo
  }
  return null;
}

function guardarPrevisao(resultado) {
  try {
    sessionStorage.setItem(CHAVE_PREVISAO, JSON.stringify({ hora: Date.now(), resultado: resultado }));
  } catch (erro) {
    // sem espaço ou sem sessionStorage: segue sem guardar
  }
}

function usarPrevisao(resultado, hora) {
  previsoes = {};
  BAIRROS.forEach((bairro, i) => previsoes[bairro.id] = resultado[i]);
  previsoesMunicipios = resultado.slice(BAIRROS.length);   // mapa.js
  const horario = new Date(hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const status = document.getElementById("status-previsao");
  status.className = "status";
  status.textContent = "Previsão da Open-Meteo atualizada às " + horario + ".";
}

function avisarFalhaNaPrevisao() {
  const status = document.getElementById("status-previsao");
  status.className = "status erro";
  status.textContent = "Não foi possível obter a previsão agora. Tente de novo ou teste no ";
  const link = document.createElement("a");
  link.href = "simulador.html";
  link.textContent = "Simulador";
  status.append(link, ".");
}

// Uma chamada só para os bairros e os municípios do mapa.
// forcar = true (botão "Atualizar previsão"): ignora a previsão guardada.
async function buscarPrevisaoReal(forcar) {
  if (forcar) semanas = {};   // o botão também renova os próximos 7 dias
  const guardada = forcar ? null : previsaoGuardada();
  if (guardada) {
    esperandoPrevisao = false;
    usarPrevisao(guardada.resultado, guardada.hora);
    atualizarTela();
    return;
  }

  const estaBusca = ++ultimaBusca;   // o timer e a resposta de uma busca antiga não mexem nesta
  const botao = document.getElementById("btn-buscar");
  const status = document.getElementById("status-previsao");
  botao.disabled = true;
  status.className = "status";
  status.textContent = "Buscando a previsão…";
  esperandoPrevisao = true;
  atualizarTela();

  // Mais de 10 s: avisa e libera o botão
  setTimeout(function () {
    if (estaBusca === ultimaBusca && esperandoPrevisao) {
      esperandoPrevisao = false;
      avisarFalhaNaPrevisao();
      botao.disabled = false;
      atualizarTela();
    }
  }, 10000);

  try {
    const resultado = await buscarPrevisao(BAIRROS.concat(OUTROS_MUNICIPIOS));
    if (estaBusca !== ultimaBusca || !esperandoPrevisao) return;   // atrasada ou já substituída: ignora
    esperandoPrevisao = false;
    guardarPrevisao(resultado);
    usarPrevisao(resultado, Date.now());
    if (forcar) registrarAlerta();   // só conta quando a pessoa pede
  } catch (erro) {
    if (estaBusca !== ultimaBusca || !esperandoPrevisao) return;
    esperandoPrevisao = false;
    avisarFalhaNaPrevisao();
  }

  botao.disabled = false;
  atualizarTela();
}

// ---------- Próximos 7 dias (só na Solução) ----------

// Busca à parte, só do lugar escolhido: a chamada dos 134 lugares continua com 24 h
let semanas = {};                         // chave do lugar ("b12", "m3") -> { hora, dias } ou { hora, erro: true }
const buscandoSemana = new Set();         // chaves com busca em andamento
const VALIDADE_SEMANA = 30 * 60 * 1000;   // 30 min
const ESPERA_APOS_ERRO = 60 * 1000;       // depois de uma falha, tenta de novo após 1 min
const DIAS_DA_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

// "2026-11-20" -> "Sexta, 20/11"; os dois primeiros dias são "Hoje" e "Amanhã"
function nomeDoDia(data, posicao) {
  const [ano, mes, dia] = data.split("-").map(Number);
  let nome = DIAS_DA_SEMANA[new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay()];   // em UTC: não depende do fuso
  if (posicao === 0) nome = "Hoje";
  if (posicao === 1) nome = "Amanhã";
  return nome + ", " + data.slice(8, 10) + "/" + data.slice(5, 7);
}

// Mesma regra do alerta, dia a dia: hora mais chuvosa e total do dia (faixas do INMET)
// e o risco do bairro. Fora da capital, só a chuva.
function nivelDoDia(dia) {
  const nivel = classificarChuva(dia.mmHoraMax, dia.mmDia);
  if (municipioEscolhido !== null) return nivel;
  return ajustarPorVulnerabilidade(nivel, bairroEscolhido.vulnerabilidade);
}

function textoDoDia(dia) {
  let texto = dia.mmDia < 0.1
    ? "Sem chuva prevista"
    : formatarMm(dia.mmDia) + " mm no dia, até " + formatarMm(dia.mmHoraMax) + " mm/h";
  if (dia.chance !== null) texto += ". Chance de chuva: " + dia.chance + "%";
  return texto + ".";
}

function conteudoDaSemana() {
  const chave = chaveDoEscolhido();
  const guardada = semanas[chave];
  if (!guardada || (guardada.erro && buscandoSemana.has(chave))) {
    return `<p class="nota">Buscando a previsão da semana…</p>`;
  }
  if (guardada.erro) {
    return `<p class="nota">Previsão da semana indisponível agora. Tente o botão "Atualizar previsão".</p>`;
  }
  // Selo curto, só o nome do nível: a situação (perigo, grande perigo) já está no painel e na legenda
  const dias = guardada.dias.map(function (dia, i) {
    const nivel = nivelDoDia(dia);
    // A partir do quarto dia, a marca "Tendência" vai junto dos números que ela qualifica
    const tendencia = i >= 3 ? `<span class="dia-tendencia">Tendência</span> ` : "";
    return `
      <li class="dia">
        <span class="dia-nome">${nomeDoDia(dia.data, i)}</span>
        <span class="selo alerta-${nivel}">${INFO_NIVEL[nivel].nome}</span>
        <span class="dia-chuva">${tendencia}${textoDoDia(dia)}</span>
      </li>`;
  }).join("");
  return `<ol class="semana-lista">${dias}</ol>`;
}

// Cartão "Próximos 7 dias" (só na Solução). Fica fora do painel: no computador, embaixo do mapa
function renderizarSemana() {
  const titulo = document.getElementById("titulo-semana");
  if (!titulo) return;   // Simulador: sem o cartão
  titulo.textContent = "Próximos 7 dias: " + nomeDoLugarEscolhido();
  atualizarCaixaDaSemana();
  pedirSemana();
}

// Redesenha só a caixa da semana, sem refazer o painel
function atualizarCaixaDaSemana() {
  const caixa = document.getElementById("semana-conteudo");
  if (caixa) caixa.innerHTML = conteudoDaSemana();
}

// Busca a semana do lugar escolhido se ainda não tem ou se já venceu
async function pedirSemana() {
  const chave = chaveDoEscolhido();
  if (!document.getElementById("semana-conteudo") || buscandoSemana.has(chave)) return;
  const guardada = semanas[chave];
  const validade = guardada && guardada.erro ? ESPERA_APOS_ERRO : VALIDADE_SEMANA;
  if (guardada && Date.now() - guardada.hora < validade) return;

  const lugar = municipioEscolhido !== null ? OUTROS_MUNICIPIOS[municipioEscolhido] : bairroEscolhido;
  buscandoSemana.add(chave);
  atualizarCaixaDaSemana();   // troca o aviso de falha por "Buscando..."
  try {
    semanas[chave] = { hora: Date.now(), dias: await buscarSemana(lugar) };   // api.js
  } catch (erro) {
    semanas[chave] = { hora: Date.now(), erro: true };
  }
  buscandoSemana.delete(chave);
  // A pessoa pode ter trocado de lugar enquanto esperava: aí a caixa já é de outro lugar
  if (chave === chaveDoEscolhido()) atualizarCaixaDaSemana();
}

// ---------- Eventos ----------

// Controle de chuva (só no Simulador)
const faixaChuva = document.getElementById("faixa-chuva");

function lerControleDeChuva() {
  chuvaSimulada = Number(faixaChuva.value);
  document.getElementById("valor-chuva").textContent = chuvaSimulada + " mm/h";
  faixaChuva.setAttribute("aria-valuetext", chuvaSimulada + " milímetros por hora");
}

if (faixaChuva) {
  faixaChuva.addEventListener("input", function () {
    lerControleDeChuva();
    atualizarTela();
  });
  // Conta o alerta só ao soltar o controle
  faixaChuva.addEventListener("change", function () {
    registrarAlerta();
  });
}

// Botão "Atualizar previsão" (só na Solução)
const botaoAtualizar = document.getElementById("btn-buscar");
if (botaoAtualizar) botaoAtualizar.addEventListener("click", () => buscarPrevisaoReal(true));

// Filtros e cards da seção Bairros (só na Solução)
if (document.getElementById("lista-bairros")) {
  for (const nome of ["regiao", "risco", "nivel", "ordem"]) {
    const select = document.getElementById("filtro-" + nome);
    select.addEventListener("change", function () {
      filtros[nome] = select.value;
      renderizarCards(bairrosFiltrados());
    });
  }
  // "Ver no painel": um ouvinte para todos os cards
  document.getElementById("lista-bairros").addEventListener("click", function (evento) {
    const id = evento.target.getAttribute("data-id");
    if (!id) return;
    escolherBairro(id);
    document.getElementById("painel-resultado").scrollIntoView({ block: "nearest" });
  });
}

// O controle de chuva e os filtros valem como estão na tela. Ao voltar para a página
// (Voltar/Avançar), o navegador devolve os dois na posição de antes, mas só depois que
// os scripts rodaram: por isso eles são lidos de novo no "pageshow".
function lerControles() {
  if (faixaChuva) lerControleDeChuva();
  for (const nome of Object.keys(filtros)) {
    const select = document.getElementById("filtro-" + nome);
    if (select) filtros[nome] = select.value;
  }
}

window.addEventListener("pageshow", function () {
  const antes = JSON.stringify([chuvaSimulada, filtros]);
  lerControles();
  if (JSON.stringify([chuvaSimulada, filtros]) !== antes) atualizarTela();
});

// Outra aba ou o botão Voltar mudaram o estado: o painel segue o lugar escolhido lá
quandoEstadoMudar(function () {
  municipioEscolhido = cidadeDoEstado();
  bairroEscolhido = buscarBairro(estado.bairro) || bairroEscolhido;
  mostrarNoCampo(nomeDoLugarEscolhido());
  atualizarTela();
});

// Primeira visita: o bairro mostrado no painel vira o do estado, para
// "Receber alertas deste bairro" já levar o bairro ao Cadastro
if (municipioEscolhido === null && estado.bairro !== bairroEscolhido.id) {
  estado.bairro = bairroEscolhido.id;
  salvarEstado();
}

lerControles();
mostrarNoCampo(nomeDoLugarEscolhido());
atualizarTela();
if (modo === "previsao") buscarPrevisaoReal(false);
