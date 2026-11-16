// api.js — previsão de chuva da Open-Meteo (gratuita e sem chave): https://open-meteo.com

// Busca a previsão de vários lugares numa única chamada.
// Cada lugar precisa ter latitude e longitude. A resposta vem na mesma ordem da lista.
async function buscarPrevisao(lugares) {
  const latitudes = lugares.map(lugar => lugar.latitude).join(",");
  const longitudes = lugares.map(lugar => lugar.longitude).join(",");
  const url = "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" + latitudes +
    "&longitude=" + longitudes +
    "&hourly=precipitation&daily=precipitation_sum" +
    "&timezone=America/Sao_Paulo&forecast_days=2";

  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error("A API respondeu com erro " + resposta.status);
  }
  const dados = await resposta.json();

  // Com um lugar só a API devolve um objeto; com vários, uma lista
  const lista = Array.isArray(dados) ? dados : [dados];
  return lista.map(lerPrevisao);
}

// Hora atual no formato da API, por exemplo "2026-11-16T15:00"
function horaAtual() {
  const agora = new Date();
  const doisDigitos = numero => String(numero).padStart(2, "0");
  return agora.getFullYear() + "-" + doisDigitos(agora.getMonth() + 1) + "-" + doisDigitos(agora.getDate()) +
    "T" + doisDigitos(agora.getHours()) + ":00";
}

// Das próximas 24 horas, pega a hora mais chuvosa. Também lê o total previsto para hoje.
function lerPrevisao(resposta) {
  const horas = resposta.hourly.time;
  const chuvas = resposta.hourly.precipitation;

  let inicio = horas.indexOf(horaAtual());
  if (inicio === -1) inicio = 0;

  let mmHoraMax = 0;
  let indicePico = -1;
  for (let i = inicio; i < inicio + 24 && i < horas.length; i++) {
    if (chuvas[i] > mmHoraMax) {
      mmHoraMax = chuvas[i];
      indicePico = i;
    }
  }

  return {
    mmHoraMax: mmHoraMax,
    mmDia: resposta.daily.precipitation_sum[0] || 0,
    horaPico: indicePico === -1 ? null : horas[indicePico],
    horasAtePico: indicePico === -1 ? null : indicePico - inicio
  };
}
