// mapa.js — mapa da Grande São Paulo desenhado em SVG, sem biblioteca.
// A capital aparece dividida nos seus 96 bairros (distritos); os outros 38 municípios aparecem inteiros.
// Cada área é um <path> com a classe CSS do nível de alerta ("mapa-alerta-<nível>").
// Usa as regras e o estado de simulacao.js.
//
// O desenho é feito uma vez só. Depois, mudar a chuva só troca as classes de cor,
// e o zoom só troca a parte do desenho que aparece (o viewBox).

const LARGURA_MAPA = 800;

// Os municípios em volta da capital (a capital é desenhada pelos seus bairros)
const OUTROS_MUNICIPIOS = MUNICIPIOS_RMSP.filter(municipio => municipio.nome !== "São Paulo");

let previsoesMunicipios = [];   // previsão real de cada município de OUTROS_MUNICIPIOS (preenchida em simulacao.js)

// Na simulação, a chuva de cada município varia em torno do valor do controle,
// como numa chuva de verdade. O fator (de 0,6 a 1,4) é sorteado uma vez ao abrir a página.
const fatorDeChuva = OUTROS_MUNICIPIOS.map(() => 0.6 + Math.random() * 0.8);

// ---------- Conversão de latitude/longitude para pontos do desenho ----------

// Um contorno pode ter mais de um polígono (ilhas, partes separadas)
function poligonosDe(geometria) {
  return geometria.type === "Polygon" ? [geometria.coordinates] : geometria.coordinates;
}

let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
for (const municipio of MUNICIPIOS_RMSP) {
  for (const poligono of poligonosDe(municipio.geometria)) {
    for (const ponto of poligono[0]) {
      minLon = Math.min(minLon, ponto[0]);
      maxLon = Math.max(maxLon, ponto[0]);
      minLat = Math.min(minLat, ponto[1]);
      maxLat = Math.max(maxLat, ponto[1]);
    }
  }
}

// Perto da linha do Equador um grau de longitude vale quase um de latitude; em São Paulo, menos.
const cosLatitude = Math.cos((minLat + maxLat) / 2 * Math.PI / 180);
const escala = LARGURA_MAPA / ((maxLon - minLon) * cosLatitude);
const ALTURA_MAPA = Math.round((maxLat - minLat) * escala);

function x(longitude) { return ((longitude - minLon) * cosLatitude * escala).toFixed(1); }
function y(latitude) { return ((maxLat - latitude) * escala).toFixed(1); }

function caminhoSvg(geometria) {
  let d = "";
  for (const poligono of poligonosDe(geometria)) {
    for (const anel of poligono) {
      d += "M" + anel.map(ponto => x(ponto[0]) + " " + y(ponto[1])).join("L") + "Z";
    }
  }
  return d;
}

// ---------- Chuva e nível de cada município ----------

function chuvaDoMunicipio(indice) {
  if (modo === "simulacao") {
    return { mmHoraMax: chuvaSimulada * fatorDeChuva[indice], mmDia: 0, horaPico: null };
  }
  return previsoesMunicipios[indice] || null;
}

// O município usa só a chuva. O ajuste pelo risco vale para os bairros da capital,
// os únicos com áreas de risco levantadas.
function nivelDoMunicipio(indice) {
  const chuva = chuvaDoMunicipio(indice);
  return chuva ? classificarChuva(chuva.mmHoraMax, chuva.mmDia) : null;
}

// ---------- Desenho (feito uma vez) ----------

const svgMapa = document.getElementById("mapa-svg");

function desenharMapa() {
  let html = "";

  // Contorno da capital por baixo dos bairros: tapa qualquer frestinha entre as divisas
  html += `<path class="mapa-fundo-capital" d="${caminhoSvg(CONTORNO_CAPITAL)}"></path>`;

  OUTROS_MUNICIPIOS.forEach(function (municipio, i) {
    html += `<path class="mapa-municipio" d="${caminhoSvg(municipio.geometria)}" tabindex="0" data-indice="${i}"></path>`;
  });

  for (const bairro of BAIRROS) {
    html += `<path class="mapa-bairro" d="${caminhoSvg(CONTORNOS_DISTRITOS[bairro.id])}" tabindex="0" data-bairro="${bairro.id}"></path>`;
  }

  // Contorno grosso da capital por cima, para ela se destacar na Grande São Paulo
  html += `<path class="mapa-borda-capital" d="${caminhoSvg(CONTORNO_CAPITAL)}"></path>`;

  svgMapa.innerHTML = html + ETIQUETA_SVG;   // a etiqueta vai por último para ficar por cima
  aplicarVista();
}

// ---------- Cores (a cada mudança de chuva ou de bairro escolhido) ----------

function trocarNivel(elemento, classeBase, nivel, descricao) {
  elemento.setAttribute("class", `${classeBase} mapa-alerta-${nivel || "indisponivel"}`);
  elemento.setAttribute("aria-label", descricao + ": " + (nivel ? INFO_NIVEL[nivel].nome : "previsão indisponível"));
}

function atualizarCoresDoMapa() {
  svgMapa.querySelectorAll("[data-indice]").forEach(function (elemento) {
    const indice = Number(elemento.getAttribute("data-indice"));
    trocarNivel(elemento, "mapa-municipio", nivelDoMunicipio(indice), OUTROS_MUNICIPIOS[indice].nome);
  });

  svgMapa.querySelectorAll("[data-bairro]").forEach(function (elemento) {
    const bairro = buscarBairro(elemento.getAttribute("data-bairro"));
    const escolhido = bairro.id === bairroEscolhido.id ? " escolhido" : "";
    trocarNivel(elemento, "mapa-bairro" + escolhido, nivelDoBairro(bairro), bairro.nome + " (bairro da capital)");
  });

  // O bairro escolhido vai para o fim da lista, para o contorno grosso dele não ficar escondido
  const escolhido = svgMapa.querySelector(".mapa-bairro.escolhido");
  svgMapa.insertBefore(escolhido, svgMapa.querySelector(".mapa-borda-capital"));

  escreverResumoDoMapa();
  if (municipioAberto !== null) mostrarMunicipio(municipioAberto);
}

function escreverResumoDoMapa() {
  const contagem = { verde: 0, amarelo: 0, laranja: 0, vermelho: 0, indisponivel: 0 };
  for (const bairro of BAIRROS) contagem[nivelDoBairro(bairro) || "indisponivel"]++;
  let texto = `Bairros da capital: ${contagem.verde} em verde, ${contagem.amarelo} em amarelo, ` +
    `${contagem.laranja} em laranja e ${contagem.vermelho} em vermelho.`;
  if (contagem.indisponivel > 0) texto += ` Sem previsão: ${contagem.indisponivel}.`;
  document.getElementById("resumo-mapa").textContent = texto;
}

// ---------- Zoom e movimento ----------

const MAIOR_ZOOM = 12;    // de perto, a área visível fica 12 vezes menor que o mapa inteiro
const PROPORCAO = 0.85;   // altura da janela do mapa / largura: mais alta que a Grande SP, porque a capital é comprida

const vistaInteira = { x: 0, y: (ALTURA_MAPA - LARGURA_MAPA * PROPORCAO) / 2, largura: LARGURA_MAPA, altura: LARGURA_MAPA * PROPORCAO };
let vista = Object.assign({}, vistaInteira);

// Mantém a vista dentro do mapa e entre o zoom mínimo e o máximo
function ajustarVista() {
  vista.largura = Math.min(LARGURA_MAPA, Math.max(LARGURA_MAPA / MAIOR_ZOOM, vista.largura));
  vista.altura = vista.largura * PROPORCAO;
  vista.x = Math.min(LARGURA_MAPA - vista.largura, Math.max(0, vista.x));
  if (vista.altura >= ALTURA_MAPA) {
    vista.y = (ALTURA_MAPA - vista.altura) / 2;   // o mapa inteiro cabe na altura: fica centralizado
  } else {
    vista.y = Math.min(ALTURA_MAPA - vista.altura, Math.max(0, vista.y));
  }
}

function aplicarVista() {
  ajustarVista();
  svgMapa.setAttribute("viewBox", `${vista.x} ${vista.y} ${vista.largura} ${vista.altura}`);
  // Ampliado, o mapa pode ser arrastado (no celular, o dedo move o mapa e não a página)
  svgMapa.classList.toggle("ampliado", vista.largura < LARGURA_MAPA);
  const nivelDoZoom = Math.round(LARGURA_MAPA / vista.largura * 10) / 10;
  document.getElementById("nivel-zoom").textContent = "Zoom: " + String(nivelDoZoom).replace(".", ",") + "×";
  esconderEtiqueta();
}

// Aproxima (fator maior que 1) ou afasta (menor que 1) mantendo parado o ponto (px, py) do desenho
function zoom(fator, px, py) {
  const novaLargura = vista.largura / fator;
  vista.x = px - (px - vista.x) * novaLargura / vista.largura;
  vista.y = py - (py - vista.y) * novaLargura / vista.largura;
  vista.largura = novaLargura;
  aplicarVista();
}

function zoomNoCentro(fator) {
  zoom(fator, vista.x + vista.largura / 2, vista.y + vista.altura / 2);
}

// Mostra uma área inteira (x, y, largura, altura do desenho) no centro do mapa.
// "margem" é quanto de espaço sobra em volta: 1,1 = quase justo; 3 = mostra também os vizinhos.
function mostrarArea(area, margem) {
  const largura = Math.max(area.largura, area.altura / PROPORCAO) * margem;
  vista.largura = Math.min(LARGURA_MAPA, Math.max(LARGURA_MAPA / MAIOR_ZOOM, largura));
  vista.x = area.x + area.largura / 2 - vista.largura / 2;
  vista.y = area.y + area.altura / 2 - (vista.largura * PROPORCAO) / 2;
  aplicarVista();
}

function areaDoElemento(elemento) {
  const caixa = elemento.getBBox();
  return { x: caixa.x, y: caixa.y, largura: caixa.width, altura: caixa.height };
}

// Ponto da tela (posição do mouse) -> ponto do desenho
function pontoDoDesenho(xTela, yTela) {
  const ponto = svgMapa.createSVGPoint();
  ponto.x = xTela;
  ponto.y = yTela;
  return ponto.matrixTransform(svgMapa.getScreenCTM().inverse());
}

// ---------- Etiqueta que aparece ao passar o mouse (ou ao focar com Tab) ----------
// A etiqueta é desenhada dentro do próprio SVG e posicionada só com atributos (x, y, transform),
// sem CSS inline.

const ETIQUETA_SVG = `<g class="etiqueta-mapa" id="etiqueta-mapa" visibility="hidden" aria-hidden="true">
  <rect rx="2"></rect>
  <text><tspan class="etiqueta-nome"></tspan><tspan></tspan><tspan></tspan></text>
</g>`;

// -23.5614 vira "23,56° S" e -46.5964 vira "46,60° O" (São Paulo fica ao sul e a oeste)
function formatarCoordenadas(latitude, longitude) {
  const grau = valor => Math.abs(valor).toFixed(2).replace(".", ",") + "°";
  return grau(latitude) + " S, " + grau(longitude) + " O";
}

// As três linhas da etiqueta para o elemento do mapa (município ou bairro).
// Devolve null se o elemento não for um município nem um bairro.
function linhasDaEtiqueta(elemento) {
  const indice = elemento.getAttribute("data-indice");
  const idBairro = elemento.getAttribute("data-bairro");
  if (indice !== null) {
    const municipio = OUTROS_MUNICIPIOS[indice];
    return [municipio.nome, "Sub-região " + municipio.subregiao + " da Grande SP",
      formatarCoordenadas(municipio.latitude, municipio.longitude)];
  }
  if (idBairro !== null) {
    const bairro = buscarBairro(idBairro);
    return [bairro.nome, nomeDaRegiao(bairro.regiao) + " · Subprefeitura " + bairro.subprefeitura,
      formatarCoordenadas(bairro.latitude, bairro.longitude)];
  }
  return null;
}

// Mostra a etiqueta perto do ponto (xTela, yTela), sem deixar sair do mapa
function mostrarEtiqueta(elemento, xTela, yTela) {
  const linhas = linhasDaEtiqueta(elemento);
  if (!linhas) {
    esconderEtiqueta();
    return;
  }
  const grupo = document.getElementById("etiqueta-mapa");
  const texto = grupo.querySelector("text");
  const fundo = grupo.querySelector("rect");
  const tamanho = vista.largura / LARGURA_MAPA;   // ampliado, a etiqueta precisa ser menor no desenho
  const folga = 8 * tamanho;

  // Texto: uma linha embaixo da outra
  texto.setAttribute("font-size", 13 * tamanho);
  grupo.querySelectorAll("tspan").forEach(function (linha, i) {
    linha.textContent = linhas[i];
    linha.setAttribute("x", folga);
    linha.setAttribute("y", folga + (i + 1) * 16 * tamanho);
  });
  const medida = texto.getBBox();
  fundo.setAttribute("x", medida.x - folga);
  fundo.setAttribute("y", medida.y - folga);
  fundo.setAttribute("width", medida.width + 2 * folga);
  fundo.setAttribute("height", medida.height + 2 * folga);

  // Fica um pouco abaixo e à direita do mouse; perto da borda, vai para o outro lado
  const p = pontoDoDesenho(xTela, yTela);
  const largura = medida.width + 2 * folga;
  const altura = medida.height + 2 * folga;
  let px = p.x + 12 * tamanho;
  let py = p.y + 12 * tamanho;
  if (px + largura > vista.x + vista.largura) px = p.x - largura - 12 * tamanho;
  if (py + altura > vista.y + vista.altura) py = p.y - altura - 12 * tamanho;
  grupo.setAttribute("transform", `translate(${Math.max(vista.x, px)} ${Math.max(vista.y, py)})`);
  grupo.setAttribute("visibility", "visible");
}

function esconderEtiqueta() {
  const grupo = document.getElementById("etiqueta-mapa");
  if (grupo) grupo.setAttribute("visibility", "hidden");
}

// ---------- Caixa de detalhes abaixo do mapa ----------

let municipioAberto = null;   // índice do município mostrado na caixa (null quando é um bairro)

function mostrarMunicipio(indice) {
  municipioAberto = indice;
  const municipio = OUTROS_MUNICIPIOS[indice];
  const chuva = chuvaDoMunicipio(indice);
  const nivel = nivelDoMunicipio(indice);
  const info = document.getElementById("info-mapa");

  if (!chuva) {
    info.innerHTML = `
      <div class="info-titulo"><h3>${municipio.nome}</h3>${seloDoNivel(null)}</div>
      <p>Sem previsão para este município agora. Use a chuva simulada.</p>`;
    return;
  }

  let dados;
  if (modo === "simulacao") {
    dados = `<div><dt>Chuva simulada</dt><dd>${formatarMm(chuva.mmHoraMax)} mm/h</dd></div>`;
  } else {
    const pico = chuva.horaPico ? Number(chuva.horaPico.slice(11, 13)) + "h" : "sem chuva prevista";
    dados = `
      <div><dt>Chuva máxima (24 h)</dt><dd>${formatarMm(chuva.mmHoraMax)} mm/h</dd></div>
      <div><dt>Horário do pico</dt><dd>${pico}</dd></div>
      <div><dt>Total previsto hoje</dt><dd>${formatarMm(chuva.mmDia)} mm</dd></div>`;
  }

  info.innerHTML = `
    <div class="info-titulo"><h3>${municipio.nome}</h3>${seloDoNivel(nivel)}</div>
    <dl class="info-dados">${dados}</dl>
    <p class="info-fazer"><strong>O que fazer:</strong> ${INFO_NIVEL[nivel].oQueFazer}</p>`;
}

// Bairro clicado no mapa: vira o bairro escolhido do simulador
function mostrarBairroDoMapa(bairro) {
  municipioAberto = null;
  escolherBairro(bairro.id);   // simulacao.js
  const nivel = nivelDoBairro(bairro);
  document.getElementById("info-mapa").innerHTML = `
    <div class="info-titulo"><h3>${bairro.nome}</h3>${seloDoNivel(nivel)}</div>
    <p>${nomeDaRegiao(bairro.regiao)} · Subprefeitura ${bairro.subprefeitura}. Risco do bairro: ${RISCO_DO_BAIRRO[bairro.vulnerabilidade]}.</p>
    <p class="info-fazer">Este bairro agora está escolhido no simulador. <a href="#simulador">Ver o resultado completo</a>.</p>`;
}

function escolherNoMapa(elemento) {
  const indice = elemento.getAttribute("data-indice");
  const idBairro = elemento.getAttribute("data-bairro");
  if (indice !== null) mostrarMunicipio(Number(indice));
  if (idBairro !== null) mostrarBairroDoMapa(buscarBairro(idBairro));
}

// ---------- Eventos do mapa ----------

// Arrastar para mover (só com o mapa ampliado)
let arrasto = null;       // posição de onde o arrasto começou
let arrastou = false;     // depois de arrastar, o clique que vem junto não escolhe nada

svgMapa.addEventListener("pointerdown", function (evento) {
  if (vista.largura >= LARGURA_MAPA || evento.button !== 0) return;
  arrasto = { x: evento.clientX, y: evento.clientY, vistaX: vista.x, vistaY: vista.y };
  arrastou = false;
});

svgMapa.addEventListener("pointermove", function (evento) {
  if (arrasto) {
    const desenhoPorPixel = vista.largura / svgMapa.getBoundingClientRect().width;
    const dx = evento.clientX - arrasto.x;
    const dy = evento.clientY - arrasto.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) arrastou = true;
    if (arrastou) {
      vista.x = arrasto.vistaX - dx * desenhoPorPixel;
      vista.y = arrasto.vistaY - dy * desenhoPorPixel;
      aplicarVista();
      return;
    }
  }
  mostrarEtiqueta(evento.target, evento.clientX, evento.clientY);
});

window.addEventListener("pointerup", function () {
  arrasto = null;
});

svgMapa.addEventListener("mouseleave", esconderEtiqueta);

svgMapa.addEventListener("click", function (evento) {
  if (arrastou) {
    arrastou = false;
    return;
  }
  escolherNoMapa(evento.target);
});

// Duplo clique aproxima naquele ponto
svgMapa.addEventListener("dblclick", function (evento) {
  const p = pontoDoDesenho(evento.clientX, evento.clientY);
  zoom(2, p.x, p.y);
});

// Ctrl + roda do mouse aproxima ou afasta; a roda sozinha continua rolando a página
svgMapa.addEventListener("wheel", function (evento) {
  if (!evento.ctrlKey && !evento.metaKey) return;
  evento.preventDefault();
  const p = pontoDoDesenho(evento.clientX, evento.clientY);
  zoom(evento.deltaY < 0 ? 1.25 : 0.8, p.x, p.y);
}, { passive: false });

// Teclado: Tab passa pelas áreas, Enter escolhe, + e − aproximam, setas movem
svgMapa.addEventListener("keydown", function (evento) {
  const passo = vista.largura / 8;
  if (evento.key === "Enter" || evento.key === " ") escolherNoMapa(evento.target);
  else if (evento.key === "+" || evento.key === "=") zoomNoCentro(1.5);
  else if (evento.key === "-") zoomNoCentro(1 / 1.5);
  else if (evento.key === "ArrowLeft") vista.x -= passo;
  else if (evento.key === "ArrowRight") vista.x += passo;
  else if (evento.key === "ArrowUp") vista.y -= passo;
  else if (evento.key === "ArrowDown") vista.y += passo;
  else return;
  evento.preventDefault();
  if (evento.key.startsWith("Arrow")) aplicarVista();
});

svgMapa.addEventListener("focusin", function (evento) {
  const area = evento.target.getBoundingClientRect();
  mostrarEtiqueta(evento.target, area.left + area.width / 2, area.top + area.height / 2);
});

svgMapa.addEventListener("focusout", esconderEtiqueta);

// Botões de zoom
document.getElementById("zoom-mais").addEventListener("click", () => zoomNoCentro(1.5));
document.getElementById("zoom-menos").addEventListener("click", () => zoomNoCentro(1 / 1.5));
document.getElementById("zoom-tudo").addEventListener("click", function () {
  vista = Object.assign({}, vistaInteira);
  aplicarVista();
});
document.getElementById("zoom-capital").addEventListener("click", function () {
  mostrarArea(areaDoElemento(svgMapa.querySelector(".mapa-borda-capital")), 1.1);
});
document.getElementById("zoom-escolhido").addEventListener("click", function () {
  mostrarArea(areaDoElemento(svgMapa.querySelector(".mapa-bairro.escolhido")), 3);
});

desenharMapa();
