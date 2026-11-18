// Mapa da Grande São Paulo em SVG, sem biblioteca.
// Desenhado uma vez; depois só mudam as classes de cor e o viewBox (zoom).

const LARGURA_MAPA = 800;

// A capital é desenhada pelos bairros
const OUTROS_MUNICIPIOS = MUNICIPIOS_RMSP.filter(municipio => municipio.nome !== "São Paulo");

let previsoesMunicipios = [];   // preenchida em simulacao.js

// Na simulação, cada município recebe de 0,6 a 1,4 vez a chuva do controle (sorteado ao abrir)
const fatorDeChuva = OUTROS_MUNICIPIOS.map(() => 0.6 + Math.random() * 0.8);

// ---------- Latitude/longitude -> desenho ----------

// Polygon ou MultiPolygon
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

// Em São Paulo, um grau de longitude é menor que um de latitude
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

// Município usa só a chuva: o risco só existe para os bairros da capital
function nivelDoMunicipio(indice) {
  const chuva = chuvaDoMunicipio(indice);
  return chuva ? classificarChuva(chuva.mmHoraMax, chuva.mmDia) : null;
}

// ---------- Desenho ----------

const svgMapa = document.getElementById("mapa-svg");

function desenharMapa() {
  let html = "";

  // Fundo da capital: tapa frestas entre os bairros
  html += `<path class="mapa-fundo-capital" d="${caminhoSvg(CONTORNO_CAPITAL)}"></path>`;

  OUTROS_MUNICIPIOS.forEach(function (municipio, i) {
    html += `<path class="mapa-municipio" d="${caminhoSvg(municipio.geometria)}" tabindex="0" data-indice="${i}"></path>`;
  });

  for (const bairro of BAIRROS) {
    html += `<path class="mapa-bairro" d="${caminhoSvg(CONTORNOS_DISTRITOS[bairro.id])}" tabindex="0" data-bairro="${bairro.id}"></path>`;
  }

  // Borda grossa da capital por cima
  html += `<path class="mapa-borda-capital" d="${caminhoSvg(CONTORNO_CAPITAL)}"></path>`;

  // Contorno do bairro ou da cidade escolhida, por cima de tudo (o desenho vem em atualizarCoresDoMapa)
  html += `<path class="mapa-contorno-escolhido" id="contorno-escolhido" aria-hidden="true"></path>`;

  // Contorno do foco do teclado, por cima até do escolhido: fundo branco e linha na cor de foco
  html += `<g class="mapa-foco" aria-hidden="true"><path class="foco-fundo"></path><path class="foco-linha"></path></g>`;

  svgMapa.innerHTML = html + ETIQUETA_SVG;   // etiqueta por último, por cima
  aplicarVista();
}

// ---------- Cores ----------

function trocarNivel(elemento, classeBase, nivel, descricao) {
  elemento.setAttribute("class", `${classeBase} mapa-alerta-${nivel || "indisponivel"}`);
  elemento.setAttribute("aria-label", descricao + ": " + (nivel ? INFO_NIVEL[nivel].nome : textoSemPrevisao().toLowerCase()));
}

function atualizarCoresDoMapa() {
  // municipioEscolhido e bairroEscolhido: simulacao.js (vale a cidade, se houver)
  svgMapa.querySelectorAll("[data-indice]").forEach(function (elemento) {
    const indice = Number(elemento.getAttribute("data-indice"));
    const escolhido = indice === municipioEscolhido ? " escolhido" : "";
    trocarNivel(elemento, "mapa-municipio" + escolhido, nivelDoMunicipio(indice), OUTROS_MUNICIPIOS[indice].nome);
  });

  svgMapa.querySelectorAll("[data-bairro]").forEach(function (elemento) {
    const bairro = buscarBairro(elemento.getAttribute("data-bairro"));
    const escolhido = municipioEscolhido === null && bairro.id === bairroEscolhido.id ? " escolhido" : "";
    trocarNivel(elemento, "mapa-bairro" + escolhido, nivelDoBairro(bairro), bairro.nome + " (bairro da capital)");
  });

  // O contorno grosso copia o desenho do escolhido: fica por cima dos vizinhos sem mudar
  // a ordem dos elementos (a ordem do Tab e o foco continuam os mesmos)
  const escolhido = svgMapa.querySelector(".escolhido");
  document.getElementById("contorno-escolhido").setAttribute("d", escolhido ? escolhido.getAttribute("d") : "");
  document.getElementById("zoom-escolhido").textContent =
    municipioEscolhido === null ? "Ver o bairro escolhido" : "Ver a cidade escolhida";

  escreverResumoDoMapa();
}

function escreverResumoDoMapa() {
  const contagem = { verde: 0, amarelo: 0, laranja: 0, vermelho: 0, indisponivel: 0 };
  for (const bairro of BAIRROS) contagem[nivelDoBairro(bairro) || "indisponivel"]++;
  let texto = `Bairros da capital: ${contagem.verde} em verde, ${contagem.amarelo} em amarelo, ` +
    `${contagem.laranja} em laranja e ${contagem.vermelho} em vermelho.`;
  if (contagem.indisponivel === BAIRROS.length) {
    // Nenhum bairro com previsão: ainda chegando (Solução) ou a busca falhou
    texto = esperandoPrevisao ? "Buscando a previsão para os bairros da capital…" : "Sem previsão para os bairros da capital agora.";
  } else if (contagem.indisponivel > 0) {
    texto += ` Sem previsão: ${contagem.indisponivel}.`;
  }
  document.getElementById("resumo-mapa").textContent = texto;
}

// ---------- Zoom e movimento ----------

const MAIOR_ZOOM = 12;    // zoom máximo: 12x
const PROPORCAO = 0.85;   // altura / largura da janela do mapa

const vistaInteira = { x: 0, y: (ALTURA_MAPA - LARGURA_MAPA * PROPORCAO) / 2, largura: LARGURA_MAPA, altura: LARGURA_MAPA * PROPORCAO };
let vista = Object.assign({}, vistaInteira);

// Mantém a vista dentro do mapa e dos limites de zoom
function ajustarVista() {
  vista.largura = Math.min(LARGURA_MAPA, Math.max(LARGURA_MAPA / MAIOR_ZOOM, vista.largura));
  vista.altura = vista.largura * PROPORCAO;
  vista.x = Math.min(LARGURA_MAPA - vista.largura, Math.max(0, vista.x));
  if (vista.altura >= ALTURA_MAPA) {
    vista.y = (ALTURA_MAPA - vista.altura) / 2;   // cabe inteiro: centraliza
  } else {
    vista.y = Math.min(ALTURA_MAPA - vista.altura, Math.max(0, vista.y));
  }
}

function aplicarVista() {
  ajustarVista();
  svgMapa.setAttribute("viewBox", `${vista.x} ${vista.y} ${vista.largura} ${vista.altura}`);
  // Ampliado, o mapa pode ser arrastado
  svgMapa.classList.toggle("ampliado", vista.largura < LARGURA_MAPA);
  const nivelDoZoom = Math.round(LARGURA_MAPA / vista.largura * 10) / 10;
  // O leitor de tela lê o zoom: só troca o texto quando ele muda (arrastar não muda)
  const rotuloZoom = document.getElementById("nivel-zoom");
  const textoZoom = "Zoom: " + String(nivelDoZoom).replace(".", ",") + "×";
  if (rotuloZoom.textContent !== textoZoom) rotuloZoom.textContent = textoZoom;
  esconderEtiqueta();
}

// fator > 1 aproxima, < 1 afasta; o ponto (px, py) fica parado
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

// Centraliza uma área; margem 1,1 = justo, 3 = mostra os vizinhos
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

// Ponto da tela -> ponto do desenho
function pontoDoDesenho(xTela, yTela) {
  const ponto = svgMapa.createSVGPoint();
  ponto.x = xTela;
  ponto.y = yTela;
  return ponto.matrixTransform(svgMapa.getScreenCTM().inverse());
}

// ---------- Etiqueta (mouse ou Tab) ----------
// Desenhada dentro do SVG e posicionada por atributos, sem CSS inline.

const ETIQUETA_SVG = `<g class="etiqueta-mapa" id="etiqueta-mapa" visibility="hidden" aria-hidden="true">
  <rect rx="2"></rect>
  <text><tspan class="etiqueta-nome"></tspan><tspan></tspan><tspan></tspan></text>
</g>`;

// -23.5614, -46.5964 -> "23,56° S, 46,60° O"
function formatarCoordenadas(latitude, longitude) {
  const grau = valor => Math.abs(valor).toFixed(2).replace(".", ",") + "°";
  return grau(latitude) + " S, " + grau(longitude) + " O";
}

// Três linhas da etiqueta (null se não for município nem bairro)
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

// Perto do ponto, sem sair do mapa
function mostrarEtiqueta(elemento, xTela, yTela) {
  const linhas = linhasDaEtiqueta(elemento);
  if (!linhas) {
    esconderEtiqueta();
    return;
  }
  const grupo = document.getElementById("etiqueta-mapa");
  const texto = grupo.querySelector("text");
  const fundo = grupo.querySelector("rect");
  const tamanho = vista.largura / LARGURA_MAPA;   // ampliado, a etiqueta encolhe no desenho
  const folga = 8 * tamanho;

  // Uma linha embaixo da outra
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

  // Abaixo e à direita do mouse; perto da borda, do outro lado
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

// Área clicada no mapa (ou achada pela localização) vira a escolhida; o resultado aparece em "Seu bairro"
function mostrarMunicipioDoMapa(indice) {
  escolherMunicipio(indice);   // simulacao.js
}

function mostrarBairroDoMapa(bairro) {
  escolherBairro(bairro.id);   // simulacao.js
}

function escolherNoMapa(elemento) {
  const indice = elemento.getAttribute("data-indice");
  const idBairro = elemento.getAttribute("data-bairro");
  if (indice !== null) mostrarMunicipioDoMapa(Number(indice));
  if (idBairro !== null) mostrarBairroDoMapa(buscarBairro(idBairro));
}

// ---------- Eventos do mapa ----------

// Arrastar (só ampliado)
let arrasto = null;       // onde o arrasto começou
let arrastou = false;     // após arrastar, o clique não escolhe

svgMapa.addEventListener("pointerdown", function (evento) {
  arrastou = false;   // clique novo: um arrasto anterior (que pode ter terminado fora do mapa) não vale mais
  if (vista.largura >= LARGURA_MAPA || evento.button !== 0) return;
  arrasto = { x: evento.clientX, y: evento.clientY, vistaX: vista.x, vistaY: vista.y };
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

// Ctrl + roda: zoom (a roda sozinha rola a página)
svgMapa.addEventListener("wheel", function (evento) {
  if (!evento.ctrlKey && !evento.metaKey) return;
  evento.preventDefault();
  const p = pontoDoDesenho(evento.clientX, evento.clientY);
  zoom(evento.deltaY < 0 ? 1.25 : 0.8, p.x, p.y);
}, { passive: false });

// Teclado: Enter escolhe, + e - dão zoom, setas movem
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

// Foco do teclado: contorno por cima de tudo (o traço do próprio elemento ficaria meio coberto pelos vizinhos)
function marcarFoco(desenho) {
  svgMapa.querySelectorAll(".mapa-foco path").forEach(caminho => caminho.setAttribute("d", desenho));
}

svgMapa.addEventListener("focusin", function (evento) {
  const area = evento.target.getBoundingClientRect();
  mostrarEtiqueta(evento.target, area.left + area.width / 2, area.top + area.height / 2);
  if (evento.target.matches(":focus-visible")) marcarFoco(evento.target.getAttribute("d") || "");
});

svgMapa.addEventListener("focusout", function () {
  esconderEtiqueta();
  marcarFoco("");
});

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
  // Bairro: margem 3, para ver os vizinhos; cidade, que é maior: 1,5
  mostrarArea(areaDoElemento(svgMapa.querySelector(".escolhido")), municipioEscolhido === null ? 3 : 1.5);
});

desenharMapa();
