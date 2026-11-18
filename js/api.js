// https://open-meteo.com
// Vários lugares numa chamada só; a resposta vem na mesma ordem
async function buscarPrevisao(lugares) {
  const latitudes = lugares.map(lugar => lugar.latitude).join(",");
  const longitudes = lugares.map(lugar => lugar.longitude).join(",");
  const url = "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" + latitudes +
    "&longitude=" + longitudes +
    "&hourly=precipitation&current=precipitation" +   // "current" traz também a hora de agora
    "&timezone=America/Sao_Paulo&forecast_days=2";

  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error("A API respondeu com erro " + resposta.status);
  }
  const dados = await resposta.json();

  // Um lugar = objeto; vários = lista
  const lista = Array.isArray(dados) ? dados : [dados];
  return lista.map(lerPrevisao);
}

// Posição da hora atual na lista de horas da resposta.
// "Agora" vem da própria resposta (current.time), não depende do fuso nem do relógio do aparelho.
// Isso evita erro quando o aparelho está no fuso horário de outro país.
function posicaoDeAgora(resposta) {
  const agora = resposta.hourly.time.indexOf(resposta.current.time.slice(0, 13) + ":00");
  return agora === -1 ? 0 : agora;
}

// Chuva das próximas 24 h, hora a hora, a partir da hora atual.
// Na Open-Meteo, o valor do acumulado de uma hora X é a soma da hora anterior. Por isso cada hora é guardada pelo seu começo.
function lerPrevisao(resposta) {
  const horas = resposta.hourly.time;
  const chuvas = resposta.hourly.precipitation;
  const agora = posicaoDeAgora(resposta);

  const proximasHoras = horas.slice(agora, agora + 24);                      // começo de cada hora
  const proximasChuvas = chuvas.slice(agora + 1, agora + 25).map(mm => mm || 0);

  // Hora mais chuvosa (se tiver mais de uma com mesmo valor, exibe a primeira)
  let mmHoraMax = 0;
  let pico = -1;
  proximasChuvas.forEach(function (mm, i) {
    if (mm > mmHoraMax) {
      mmHoraMax = mm;
      pico = i;
    }
  });

  return {
    mmHoraMax: mmHoraMax,
    mmDia: proximasChuvas.reduce((soma, mm) => soma + mm, 0),    // total das próximas 24 horas
    horaPico: pico === -1 ? null : proximasHoras[pico],          // começo da hora mais chuvosa
    horasAtePico: pico === -1 ? null : pico,                     // 0 = hora atual
    proximasHoras: proximasHoras,                                // dados para o gráfico
    proximasChuvas: proximasChuvas                               // dados para o gráfico
  };
}

// Próximos 7 dias de um lugar só (painel da Solução): chuva e chance de chuva de cada hora.
// São 8 dias de dados porque a última hora do sétimo dia só vem à meia-noite do dia seguinte.
async function buscarSemana(lugar) {
  const url = "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" + lugar.latitude +
    "&longitude=" + lugar.longitude +
    "&hourly=precipitation,precipitation_probability&current=precipitation" +
    "&timezone=America/Sao_Paulo&forecast_days=8";

  // Sem resposta em 10 s, desiste (o painel avisa)
  const resposta = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!resposta.ok) {
    throw new Error("A API respondeu com erro " + resposta.status);
  }
  return lerSemana(await resposta.json());
}

// Separa as horas por dia: hoje (só as horas que faltam) e os 6 dias seguintes.
// Como em lerPrevisao, o valor da posição i é a chuva da hora que começa em horas[i - 1].
function lerSemana(resposta) {
  const horas = resposta.hourly.time;
  const chuvas = resposta.hourly.precipitation;
  const chances = resposta.hourly.precipitation_probability || [];
  const dias = [];

  for (let i = posicaoDeAgora(resposta) + 1; i < horas.length; i++) {
    const data = horas[i - 1].slice(0, 10);   // "2026-11-18"
    let dia = dias[dias.length - 1];
    if (!dia || dia.data !== data) {
      if (dias.length === 7) break;
      dia = { data: data, mmDia: 0, mmHoraMax: 0, chance: null };
      dias.push(dia);
    }
    const mm = chuvas[i] || 0;
    dia.mmDia += mm;
    if (mm > dia.mmHoraMax) dia.mmHoraMax = mm;

    // Chance de chover mais de 0,1 mm na hora; o dia fica com a maior
    const chance = chances[i];
    if (typeof chance === "number" && (dia.chance === null || chance > dia.chance)) dia.chance = chance;
  }
  return dias;
}
