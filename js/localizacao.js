// localizacao.js — botão "Usar minha localização" da página Solução.
//
// Usa a Geolocation API do navegador. A localização só é pedida quando a pessoa clica no botão,
// e o próprio navegador pergunta se ela permite. As coordenadas ficam só nesta página:
// servem para achar o bairro no contorno dos distritos (mapa-dados.js) e são descartadas.
// Nada é guardado nem enviado.

const botaoLocalizacao = document.getElementById("btn-localizacao");
const textoLocalizacao = document.getElementById("texto-localizacao");
const statusLocalizacao = document.getElementById("status-localizacao");

// Acima disso (em metros), avisamos que a posição é aproximada
const PRECISAO_BOA = 1000;

// ---------- O ponto está dentro de qual contorno? ----------

// Lança uma linha do ponto para a direita e conta quantas bordas do contorno ela cruza:
// número ímpar de cruzamentos = o ponto está dentro.
function pontoNoAnel(longitude, latitude, anel) {
  let dentro = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const [lonI, latI] = anel[i];
    const [lonJ, latJ] = anel[j];
    const cruza = (latI > latitude) !== (latJ > latitude) &&
      longitude < (lonJ - lonI) * (latitude - latI) / (latJ - latI) + lonI;
    if (cruza) dentro = !dentro;
  }
  return dentro;
}

// Um contorno pode ter várias partes; cada parte tem o anel de fora e, às vezes, buracos
function pontoNaGeometria(longitude, latitude, geometria) {
  return poligonosDe(geometria).some(function (poligono) {   // poligonosDe: mapa.js
    const [anelDeFora, ...buracos] = poligono;
    return pontoNoAnel(longitude, latitude, anelDeFora) &&
      !buracos.some(buraco => pontoNoAnel(longitude, latitude, buraco));
  });
}

// Distância aproximada em km (suficiente para comparar bairros da mesma cidade)
function distanciaKm(lat1, lon1, lat2, lon2) {
  const kmPorGrau = 111.32;
  const dx = (lon2 - lon1) * kmPorGrau * Math.cos((lat1 + lat2) / 2 * Math.PI / 180);
  const dy = (lat2 - lat1) * kmPorGrau;
  return Math.sqrt(dx * dx + dy * dy);
}

// Devolve onde a pessoa está: um bairro da capital, outro município da Grande SP ou nada
function acharLugar(latitude, longitude) {
  const bairro = BAIRROS.find(b => pontoNaGeometria(longitude, latitude, CONTORNOS_DISTRITOS[b.id]));
  if (bairro) return { tipo: "bairro", bairro: bairro };

  // Bem na divisa entre dois distritos o ponto pode cair numa frestinha do contorno simplificado.
  // Se ele está dentro da capital, fica com o bairro de centro mais próximo.
  if (pontoNaGeometria(longitude, latitude, CONTORNO_CAPITAL)) {
    const maisProximo = BAIRROS.reduce((melhor, b) =>
      distanciaKm(latitude, longitude, b.latitude, b.longitude) <
      distanciaKm(latitude, longitude, melhor.latitude, melhor.longitude) ? b : melhor);
    return { tipo: "bairro", bairro: maisProximo };
  }

  const indice = OUTROS_MUNICIPIOS.findIndex(m => pontoNaGeometria(longitude, latitude, m.geometria));
  if (indice !== -1) return { tipo: "municipio", indice: indice };

  return null;
}

// ---------- Tela ----------

function avisarLocalizacao(tipo, texto) {
  statusLocalizacao.className = "status " + tipo;   // "sucesso", "aviso-local" ou "erro"
  statusLocalizacao.textContent = texto;
}

function esperandoLocalizacao(esperando) {
  botaoLocalizacao.disabled = esperando;
  textoLocalizacao.textContent = esperando ? "Procurando sua localização…" : "Usar minha localização";
}

// Aproxima o mapa do lugar encontrado (mapa.js)
function mostrarNoMapa(seletor, margem) {
  const elemento = svgMapa.querySelector(seletor);
  if (elemento) mostrarArea(areaDoElemento(elemento), margem);
}

function localizacaoEncontrada(posicao) {
  esperandoLocalizacao(false);
  const { latitude, longitude, accuracy } = posicao.coords;
  const lugar = acharLugar(latitude, longitude);

  // Posição imprecisa (comum em computador sem GPS): pede para a pessoa conferir
  const aproximada = function (oQue) {
    if (accuracy <= PRECISAO_BOA) return "";
    return " A posição é aproximada (cerca de " + formatarMm(accuracy / 1000) + " km): confira se " + oQue + " está certo.";
  };

  if (!lugar) {
    avisarLocalizacao("aviso-local",
      "Você parece estar fora da Grande São Paulo. O Clima Safe cobre a cidade de São Paulo: escolha um bairro abaixo.");
    return;
  }

  if (lugar.tipo === "municipio") {
    const municipio = OUTROS_MUNICIPIOS[lugar.indice];
    mostrarMunicipio(lugar.indice);                     // mapa.js
    mostrarNoMapa(`[data-indice="${lugar.indice}"]`, 1.5);
    avisarLocalizacao("aviso-local",
      "Você está em " + municipio.nome + ", fora da capital. O risco por bairro só existe para a cidade de São Paulo; " +
      "no mapa abaixo dá para ver a chuva prevista em " + municipio.nome + "." + aproximada("o município"));
    return;
  }

  // Achou o bairro: limpa a busca, para ele aparecer na lista, e escolhe
  buscaBairro.value = "";
  document.getElementById("aviso-busca").textContent = "";
  preencherSelectBairros(selectBairro);
  mostrarBairroDoMapa(lugar.bairro);                    // mapa.js (também escolhe no simulador)
  mostrarNoMapa(`[data-bairro="${lugar.bairro.id}"]`, 3);
  avisarLocalizacao("sucesso",
    "Você está em " + lugar.bairro.nome + " (" + nomeDaRegiao(lugar.bairro.regiao) + "). " +
    "O resultado do simulador já é do seu bairro." + aproximada("o bairro"));
}

function localizacaoFalhou(erro) {
  esperandoLocalizacao(false);
  const mensagens = {
    1: "Você não permitiu o acesso à localização. Tudo bem: escolha o bairro pelo nome ou na lista. " +
       "Para usar a localização depois, libere a permissão no cadeado ao lado do endereço do site.",
    2: "Não foi possível descobrir a sua localização agora. Escolha o bairro pelo nome ou na lista.",
    3: "A localização demorou demais para responder. Tente de novo ou escolha o bairro pelo nome ou na lista."
  };
  avisarLocalizacao("erro", mensagens[erro.code] || mensagens[2]);
}

botaoLocalizacao.addEventListener("click", function () {
  if (!("geolocation" in navigator)) {
    avisarLocalizacao("erro", "Este navegador não informa a localização. Escolha o bairro pelo nome ou na lista.");
    return;
  }
  esperandoLocalizacao(true);
  avisarLocalizacao("", "");
  navigator.geolocation.getCurrentPosition(localizacaoEncontrada, localizacaoFalhou, {
    enableHighAccuracy: false,   // para achar o bairro não precisa de GPS: economiza bateria
    timeout: 15000,
    maximumAge: 5 * 60 * 1000    // aceita uma posição de até 5 minutos atrás
  });
});
