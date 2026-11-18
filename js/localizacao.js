// Botão "Usar minha localização" das páginas Solução e Simulador.
// Só pede a posição no clique, com a permissão do navegador. Nada é guardado nem enviado.

const botaoLocalizacao = document.getElementById("btn-localizacao");
const textoLocalizacao = document.getElementById("texto-localizacao");
const statusLocalizacao = document.getElementById("status-localizacao");

// metros; acima disso, avisa que a posição é aproximada
const PRECISAO_BOA = 1000;

// ---------- Em qual contorno está o ponto ----------

// Raio para a direita: cruzar a borda um número ímpar de vezes = dentro
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

// Cada parte tem o anel de fora e, às vezes, buracos
function pontoNaGeometria(longitude, latitude, geometria) {
  return poligonosDe(geometria).some(function (poligono) {   // poligonosDe: mapa.js
    const [anelDeFora, ...buracos] = poligono;
    return pontoNoAnel(longitude, latitude, anelDeFora) &&
      !buracos.some(buraco => pontoNoAnel(longitude, latitude, buraco));
  });
}

// Distância aproximada em km
function distanciaKm(lat1, lon1, lat2, lon2) {
  const kmPorGrau = 111.32;
  const dx = (lon2 - lon1) * kmPorGrau * Math.cos((lat1 + lat2) / 2 * Math.PI / 180);
  const dy = (lat2 - lat1) * kmPorGrau;
  return Math.sqrt(dx * dx + dy * dy);
}

// Bairro da capital, outro município da Grande SP ou null
function acharLugar(latitude, longitude) {
  const bairro = BAIRROS.find(b => pontoNaGeometria(longitude, latitude, CONTORNOS_DISTRITOS[b.id]));
  if (bairro) return { tipo: "bairro", bairro: bairro };

  // Na divisa, o ponto pode cair numa fresta: fica o bairro de centro mais próximo
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

// tipo: "sucesso", "aviso-local" ou "erro"
function avisarLocalizacao(tipo, texto) {
  statusLocalizacao.className = "status " + tipo;
  statusLocalizacao.textContent = texto;
}

function esperandoLocalizacao(esperando) {
  botaoLocalizacao.disabled = esperando;
  textoLocalizacao.textContent = esperando ? "Procurando sua localização…" : "Usar minha localização";
}

// Aproxima o mapa do lugar (mapa.js)
function mostrarNoMapa(seletor, margem) {
  const elemento = svgMapa.querySelector(seletor);
  if (elemento) mostrarArea(areaDoElemento(elemento), margem);
}

function localizacaoEncontrada(posicao) {
  esperandoLocalizacao(false);
  const { latitude, longitude, accuracy } = posicao.coords;
  const lugar = acharLugar(latitude, longitude);

  // Posição imprecisa (comum sem GPS): pede para conferir
  const aproximada = function (oQue) {
    if (accuracy <= PRECISAO_BOA) return "";
    return " A posição é aproximada (cerca de " + formatarMm(accuracy / 1000) + " km): confira se " + oQue + " está certo.";
  };

  if (!lugar) {
    avisarLocalizacao("aviso-local",
      "Você parece estar fora da Grande São Paulo, a área do Clima Safe. Digite ou escolha o bairro ou a cidade no campo acima.");
    return;
  }

  if (lugar.tipo === "municipio") {
    const municipio = OUTROS_MUNICIPIOS[lugar.indice];
    mostrarMunicipioDoMapa(lugar.indice);               // mapa.js
    mostrarNoMapa(`[data-indice="${lugar.indice}"]`, 1.5);
    avisarLocalizacao("sucesso",
      "Você está em " + municipio.nome + ", fora da capital. O alerta já é da sua cidade; aqui ele vem só da chuva." +
      aproximada("o município"));
    return;
  }

  mostrarBairroDoMapa(lugar.bairro);                    // mapa.js
  mostrarNoMapa(`[data-bairro="${lugar.bairro.id}"]`, 3);
  avisarLocalizacao("sucesso",
    "Você está em " + lugar.bairro.nome + " (" + nomeDaRegiao(lugar.bairro.regiao) + "). " +
    "O alerta já é do seu bairro." + aproximada("o bairro"));
}

function localizacaoFalhou(erro) {
  esperandoLocalizacao(false);
  const mensagens = {
    1: "Você não permitiu o acesso à localização. Tudo bem: digite ou escolha o bairro no campo acima. " +
       "Para usar a localização depois, libere a permissão no cadeado ao lado do endereço do site.",
    2: "Não foi possível descobrir a sua localização agora. Digite ou escolha o bairro no campo acima.",
    3: "A localização demorou demais para responder. Tente de novo ou digite o bairro no campo acima."
  };
  avisarLocalizacao("erro", mensagens[erro.code] || mensagens[2]);
}

botaoLocalizacao.addEventListener("click", function () {
  if (!("geolocation" in navigator)) {
    avisarLocalizacao("erro", "Este navegador não informa a localização. Digite ou escolha o bairro no campo acima.");
    return;
  }
  esperandoLocalizacao(true);
  avisarLocalizacao("", "");
  navigator.geolocation.getCurrentPosition(localizacaoEncontrada, localizacaoFalhou, {
    enableHighAccuracy: false,   // bairro não precisa de GPS
    timeout: 15000,
    maximumAge: 5 * 60 * 1000    // aceita posição de até 5 min
  });
});
