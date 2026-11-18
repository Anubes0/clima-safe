// Os 96 bairros de São Paulo e os 40 pontos de apoio.
// Gerado das bases da Prefeitura: GeoSampa (distritos, áreas de risco, ocorrências e centros
// esportivos) e Censo 2022. Os pontos de apoio são Centros Esportivos, não abrigos oficiais.
// Vulnerabilidade: 3 = 300+ moradias em risco R3/R4 ou 10+ ocorrências em 2026;
// 2 = alguma área de risco ou ocorrência; 1 = nenhuma.

const REGIOES = ["Centro", "Norte", "Leste", "Oeste", "Sul"];

const ABRIGOS = [
  {
    id: 1,
    nome: "Centro Esportivo Aclimação (Estádio Municipal Jack Marin)",
    endereco: "Rua Muniz de Souza, 1119, Aclimação",
    telefone: null,
    latitude: -23.57194,
    longitude: -46.62838
  },
  {
    id: 2,
    nome: "Centro Esportivo Barra Funda (CEE Raul Tabajara)",
    endereco: "Rua Anhanguera, 484, Barra Funda",
    telefone: null,
    latitude: -23.52352,
    longitude: -46.65152
  },
  {
    id: 3,
    nome: "Centro Esportivo Butantã (CEE Solange Nunes Bibas)",
    endereco: "Rua Dr. Ernâni da Gama Corrêa, 367, Butantã",
    telefone: "(11) 3721-5711",
    latitude: -23.57483,
    longitude: -46.72401
  },
  {
    id: 4,
    nome: "Centro Esportivo Cambuci (CEE Rubens Pecce Lordello)",
    endereco: "Avenida Lins de Vasconcelos, 804, Cambuci",
    telefone: null,
    latitude: -23.56992,
    longitude: -46.62241
  },
  {
    id: 5,
    nome: "Centro Esportivo Campo Limpo (Mini Balneário Sinésio Rocha)",
    endereco: "Rua Cibaúma, 54, Campo Limpo",
    telefone: null,
    latitude: -23.61995,
    longitude: -46.75373
  },
  {
    id: 6,
    nome: "Centro Esportivo Casa Verde (Mini Balneário Comandante Garcia D'Ávila)",
    endereco: "Rua Armando Coelho e Silva, 775, Parque Peruche",
    telefone: "(11) 2208-2755",
    latitude: -23.49198,
    longitude: -46.65534
  },
  {
    id: 7,
    nome: "Centro Esportivo e de Lazer Perus (CEL Perus)",
    endereco: "Estrada São Paulo-jundiaí, 1031, Perus",
    telefone: null,
    latitude: -23.41706,
    longitude: -46.75558
  },
  {
    id: 8,
    nome: "Centro Esportivo Freguesia do Ó (CEE Aurélio Campos)",
    endereco: "Rua Jacutiba, 167, Freguesia do Ó",
    telefone: "(11) 3975-7569",
    latitude: -23.48322,
    longitude: -46.69377
  },
  {
    id: 9,
    nome: "Centro Esportivo Ibirapuera (CEE Mané Garrincha)",
    endereco: "Rua Pedro de Toledo, 1651, Vila Clementino",
    telefone: null,
    latitude: -23.59799,
    longitude: -46.65542
  },
  {
    id: 10,
    nome: "Centro Esportivo Ipiranga (Balneário Carlos Joel Nelli)",
    endereco: "Praça Nami Jafet, 45, Ipiranga",
    telefone: null,
    latitude: -23.5804,
    longitude: -46.60536
  },
  {
    id: 11,
    nome: "Centro Esportivo Jaguaré (Mini Balneário Marechal Espiridião Rosas)",
    endereco: "Rua General Mac Arthur, 1304, Jaguaré",
    telefone: null,
    latitude: -23.55341,
    longitude: -46.75276
  },
  {
    id: 12,
    nome: "Centro Esportivo Jardim Cabuçu (Mini Balneário Irmãos Paolillo)",
    endereco: "Rua General Jerônimo Furtado, 751, Jaçanã",
    telefone: null,
    latitude: -23.46422,
    longitude: -46.56951
  },
  {
    id: 13,
    nome: "Centro Esportivo Jardim Celeste (Balneário Mário Moraes)",
    endereco: "Rua Edward Carmilo, 840, Jardim Celeste",
    telefone: null,
    latitude: -23.5978,
    longitude: -46.7543
  },
  {
    id: 14,
    nome: "Centro Esportivo Jardim Sabará (Mini Balneário Antonio Carlos de Abreu Sodré)",
    endereco: "Rua Cúria, 149, Jardim Sabará",
    telefone: null,
    latitude: -23.68597,
    longitude: -46.68218
  },
  {
    id: 15,
    nome: "Centro Esportivo Jardim São Paulo (CEE Alfredo Inácio Trindade)",
    endereco: "Rua Viri, 425, Jardim São Paulo",
    telefone: null,
    latitude: -23.4948,
    longitude: -46.6128
  },
  {
    id: 16,
    nome: "Centro Esportivo José Bonifácio (CEL José Bonifácio)",
    endereco: "Rua Ana Perena, 110, Cohab 2",
    telefone: null,
    latitude: -23.54728,
    longitude: -46.43676
  },
  {
    id: 17,
    nome: "Centro Esportivo José de Anchieta (CEL Padre José de Anchieta)",
    endereco: "Rua José Balangio, 188, Cohab 1",
    telefone: null,
    latitude: -23.551,
    longitude: -46.48543
  },
  {
    id: 18,
    nome: "Centro Esportivo Juscelino Kubitschek (CEL Juscelino Kibitschek)",
    endereco: "Rua Inácio Monteiro, 55, Cidade Tiradentes",
    telefone: null,
    latitude: -23.56402,
    longitude: -46.40727
  },
  {
    id: 19,
    nome: "Centro Esportivo Lapa (CEE Edson Arantes do Nascimento)",
    endereco: "Rua Belmonte, 957, Alto da Lapa",
    telefone: "(11) 3834-0032",
    latitude: -23.52782,
    longitude: -46.72022
  },
  {
    id: 20,
    nome: "Centro Esportivo Mandaqui (Mini Balneário Gastão Moutinho)",
    endereco: "Rua Coronel João da Silva Feijó, 80, Mandaqui",
    telefone: null,
    latitude: -23.46994,
    longitude: -46.63939
  },
  {
    id: 21,
    nome: "Centro Esportivo Mooca (CEE Salim Farah Maluf)",
    endereco: "Rua Taquari, 635, Mooca",
    telefone: "(11) 2694-7668",
    latitude: -23.5503,
    longitude: -46.59722
  },
  {
    id: 22,
    nome: "Centro Esportivo Pirituba (CEE Geraldo José de Almeida)",
    endereco: "Avenida Agenor Couto de Magalhães, 32, Pirituba",
    telefone: null,
    latitude: -23.47902,
    longitude: -46.74063
  },
  {
    id: 23,
    nome: "Centro Esportivo Santo Amaro (CEE Joerg Bruder)",
    endereco: "Avenida Padre José Maria, 555, Santo Amaro",
    telefone: "(11) 5687-6340",
    latitude: -23.65482,
    longitude: -46.71235
  },
  {
    id: 24,
    nome: "Centro Esportivo São Mateus (Mini Balneário José Maria Whitaker)",
    endereco: "Avenida Satélite, 756, Cidade Satélite Santa Bárbara",
    telefone: null,
    latitude: -23.61074,
    longitude: -46.46457
  },
  {
    id: 25,
    nome: "Centro Esportivo Tatuapé (CEE Brigadeiro Eduardo Gomes)",
    endereco: "Rua Monte Serrat, 230, Tatuapé",
    telefone: "(11) 3904-1154",
    latitude: -23.53999,
    longitude: -46.56358
  },
  {
    id: 26,
    nome: "Centro Esportivo Teotônio Vilela (CEL Teotônio Vilela)",
    endereco: "Rua Carlo Clausetti, 19, Sapopemba",
    telefone: null,
    latitude: -23.6045,
    longitude: -46.50292
  },
  {
    id: 27,
    nome: "Centro Esportivo Tietê",
    endereco: "Avenida Santos Dumont, 843, Luz",
    telefone: null,
    latitude: -23.52052,
    longitude: -46.63213
  },
  {
    id: 28,
    nome: "Centro Esportivo Tiquatira (CEE Luiz Martinez)",
    endereco: "Avenida Governador Carvalho Pinto, 02, Tiquatira",
    telefone: "(11) 2958-9705",
    latitude: -23.5145,
    longitude: -46.5284
  },
  {
    id: 29,
    nome: "Centro Esportivo Tiradentes (CEL André Vital Ribeiro Soares)",
    endereco: "Avenida dos Metalúrgicos, 2255, Tiradentes",
    telefone: null,
    latitude: -23.59908,
    longitude: -46.40224
  },
  {
    id: 30,
    nome: "Centro Esportivo Vila Brasilândia (CEE Oswaldo Brandão)",
    endereco: "Rua Michihisa Murata, 120, Vila Brasilândia",
    telefone: null,
    latitude: -23.4758,
    longitude: -46.6983
  },
  {
    id: 31,
    nome: "Centro Esportivo Vila Carioca (Balneário Princesa Isabel)",
    endereco: "Rua Campante, 100, Vila Carioca",
    telefone: null,
    latitude: -23.59554,
    longitude: -46.59518
  },
  {
    id: 32,
    nome: "Centro Esportivo Vila Curuçá (CEE José Ermírio de Moraes)",
    endereco: "Rua Grapirá, 537, Itaim Paulista",
    telefone: null,
    latitude: -23.49834,
    longitude: -46.41912
  },
  {
    id: 33,
    nome: "Centro Esportivo Vila Guarani (CEE Riyuso Ogawa)",
    endereco: "Rua Lussanvira, 178, Vila Guarani",
    telefone: null,
    latitude: -23.64036,
    longitude: -46.63775
  },
  {
    id: 34,
    nome: "Centro Esportivo Vila Guilherme (Ginásio Darcy Reis)",
    endereco: "Avenida Guilherme, 1819, Vila Guilherme",
    telefone: null,
    latitude: -23.50795,
    longitude: -46.59988
  },
  {
    id: 35,
    nome: "Centro Esportivo Vila Independência (CEE Flávio Calabresi Conte)",
    endereco: "Rua das Municipalidades, 10, Ipiranga",
    telefone: null,
    latitude: -23.58805,
    longitude: -46.59701
  },
  {
    id: 36,
    nome: "Centro Esportivo Vila Manchester (CEE Vicente Ítalo Feola)",
    endereco: "Praça Haroldo Daltro, S/N, Vila Nova Manchester",
    telefone: null,
    latitude: -23.5473,
    longitude: -46.5327
  },
  {
    id: 37,
    nome: "Centro Esportivo Vila Maria (CEE Thomaz Mazzoni)",
    endereco: "Praça Jânio da Silva Quadros, 150, Vila Maria",
    telefone: "(11) 5574-8760",
    latitude: -23.5011,
    longitude: -46.582
  },
  {
    id: 38,
    nome: "Centro Esportivo Vila Prudente/Vila Alpina (CEE Arthur Friedenreich)",
    endereco: "Avenida Francisco Falconi, 83, Vila Alpina",
    telefone: "(11) 3209-0995",
    latitude: -23.58342,
    longitude: -46.56847
  },
  {
    id: 39,
    nome: "Centro Esportivo Vila Santa Catarina (Balneário Jalisco)",
    endereco: "Rua Rodes, 112, Vila Santa Catarina",
    telefone: null,
    latitude: -23.64224,
    longitude: -46.66749
  },
  {
    id: 40,
    nome: "Centro Esportivo, Recreativo e Educativo do Trabalhador (CERET)",
    endereco: "Rua Canuto de Abreu, S/N, Tatuapé",
    telefone: null,
    latitude: -23.5597,
    longitude: -46.5577
  }
];

const BAIRROS = [
  {
    id: 1,
    nome: "Água Rasa",
    regiao: "Leste",
    subprefeitura: "Mooca",
    latitude: -23.56684,
    longitude: -46.57188,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 2 áreas de risco de alagamento ou inundação no distrito, nenhuma de risco alto. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 85788,
    abrigoId: 40,
    distanciaAbrigoKm: 1.6
  },
  {
    id: 2,
    nome: "Alto de Pinheiros",
    regiao: "Oeste",
    subprefeitura: "Pinheiros",
    latitude: -23.54761,
    longitude: -46.71196,
    vulnerabilidade: 1,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 37359,
    abrigoId: 19,
    distanciaAbrigoKm: 2.4
  },
  {
    id: 3,
    nome: "Anhanguera",
    regiao: "Norte",
    subprefeitura: "Perus",
    latitude: -23.43049,
    longitude: -46.79313,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 2 áreas de risco de alagamento ou inundação no distrito; 1 delas é de risco alto ou muito alto, com 6 moradias. Em 2026 (até outubro), houve 2 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 75360,
    abrigoId: 7,
    distanciaAbrigoKm: 4.1
  },
  {
    id: 4,
    nome: "Aricanduva",
    regiao: "Leste",
    subprefeitura: "Aricanduva-Formosa-Carrão",
    latitude: -23.57381,
    longitude: -46.51561,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 2 áreas de risco de alagamento ou inundação no distrito, nenhuma de risco alto. Em 2026 (até outubro), houve 2 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 89574,
    abrigoId: 36,
    distanciaAbrigoKm: 3.4
  },
  {
    id: 5,
    nome: "Artur Alvim",
    regiao: "Leste",
    subprefeitura: "Penha",
    latitude: -23.54014,
    longitude: -46.48582,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 5 áreas de risco de alagamento ou inundação no distrito; 2 delas são de risco alto ou muito alto, com 135 moradias. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 95575,
    abrigoId: 17,
    distanciaAbrigoKm: 1.2
  },
  {
    id: 6,
    nome: "Barra Funda",
    regiao: "Oeste",
    subprefeitura: "Lapa",
    latitude: -23.5212,
    longitude: -46.67409,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 1 área de risco de alagamento ou inundação no distrito, nenhuma de risco alto. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 33436,
    abrigoId: 2,
    distanciaAbrigoKm: 2.3
  },
  {
    id: 7,
    nome: "Bela Vista",
    regiao: "Centro",
    subprefeitura: "Sé",
    latitude: -23.56086,
    longitude: -46.64758,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 60024,
    abrigoId: 1,
    distanciaAbrigoKm: 2.3
  },
  {
    id: 8,
    nome: "Belém",
    regiao: "Leste",
    subprefeitura: "Mooca",
    latitude: -23.5376,
    longitude: -46.59482,
    vulnerabilidade: 1,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    noticia: "No bairro Belenzinho: em 24/01/2014 o CGE listou a Av. Celso Garcia, na zona leste, entre os pontos intransitáveis.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" },
      { rotulo: "Estadão, via Tribuna do Sertão (24/01/2014)", url: "https://www.tribunadosertao.com.br/brasil/2014/01/25/151503-chuva-faz-rio-tiete-transbordar-na-zona-leste-de-sp" }
    ],
    populacaoEstimada: 55785,
    abrigoId: 21,
    distanciaAbrigoKm: 1.4
  },
  {
    id: 9,
    nome: "Bom Retiro",
    regiao: "Centro",
    subprefeitura: "Sé",
    latitude: -23.52607,
    longitude: -46.63681,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 1 área de risco de alagamento ou inundação no distrito, nenhuma de risco alto. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 33520,
    abrigoId: 27,
    distanciaAbrigoKm: 0.8
  },
  {
    id: 10,
    nome: "Brás",
    regiao: "Leste",
    subprefeitura: "Mooca",
    latitude: -23.54375,
    longitude: -46.61747,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 38750,
    abrigoId: 21,
    distanciaAbrigoKm: 2.2
  },
  {
    id: 11,
    nome: "Brasilândia",
    regiao: "Norte",
    subprefeitura: "Freguesia-Brasilândia",
    latitude: -23.44862,
    longitude: -46.68839,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 28 áreas de risco de alagamento ou inundação no distrito; 9 delas são de risco alto ou muito alto, com 495 moradias. Em 2026 (até outubro), houve 3 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 243273,
    abrigoId: 30,
    distanciaAbrigoKm: 3.2
  },
  {
    id: 12,
    nome: "Butantã",
    regiao: "Oeste",
    subprefeitura: "Butantã",
    latitude: -23.5702,
    longitude: -46.72627,
    vulnerabilidade: 1,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 51715,
    abrigoId: 3,
    distanciaAbrigoKm: 0.6
  },
  {
    id: 13,
    nome: "Cachoeirinha",
    regiao: "Norte",
    subprefeitura: "Casa Verde-Cachoeirinha",
    latitude: -23.45436,
    longitude: -46.66209,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 16 áreas de risco de alagamento ou inundação no distrito; 11 delas são de risco alto ou muito alto, com 983 moradias. Em 2026 (até outubro), houve 4 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 143366,
    abrigoId: 20,
    distanciaAbrigoKm: 2.9
  },
  {
    id: 14,
    nome: "Cambuci",
    regiao: "Centro",
    subprefeitura: "Sé",
    latitude: -23.56439,
    longitude: -46.61695,
    vulnerabilidade: 1,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 45163,
    abrigoId: 4,
    distanciaAbrigoKm: 0.8
  },
  {
    id: 15,
    nome: "Campo Belo",
    regiao: "Sul",
    subprefeitura: "Santo Amaro",
    latitude: -23.62808,
    longitude: -46.66791,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 8 áreas de risco de alagamento ou inundação no distrito; 2 delas são de risco alto ou muito alto, com 160 moradias. Em 2026 (até outubro), houve 4 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 71058,
    abrigoId: 39,
    distanciaAbrigoKm: 1.6
  },
  {
    id: 16,
    nome: "Campo Grande",
    regiao: "Sul",
    subprefeitura: "Santo Amaro",
    latitude: -23.6746,
    longitude: -46.68752,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 8 áreas de risco de alagamento ou inundação no distrito; 4 delas são de risco alto ou muito alto, com 220 moradias. Em 2026 (até outubro), houve 2 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 115925,
    abrigoId: 14,
    distanciaAbrigoKm: 1.4
  },
  {
    id: 17,
    nome: "Campo Limpo",
    regiao: "Sul",
    subprefeitura: "Campo Limpo",
    latitude: -23.63586,
    longitude: -46.7635,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 25 áreas de risco de alagamento ou inundação no distrito; 14 delas são de risco alto ou muito alto, com 1225 moradias. Em 2026 (até outubro), houve 13 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 236162,
    abrigoId: 5,
    distanciaAbrigoKm: 2.0
  },
  {
    id: 18,
    nome: "Cangaíba",
    regiao: "Leste",
    subprefeitura: "Penha",
    latitude: -23.4989,
    longitude: -46.51877,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 5 áreas de risco de alagamento ou inundação no distrito; 1 delas é de risco alto ou muito alto, com 45 moradias. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 141172,
    abrigoId: 28,
    distanciaAbrigoKm: 2.0
  },
  {
    id: 19,
    nome: "Capão Redondo",
    regiao: "Sul",
    subprefeitura: "Campo Limpo",
    latitude: -23.66877,
    longitude: -46.78051,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 55 áreas de risco de alagamento ou inundação no distrito; 24 delas são de risco alto ou muito alto, com 1500 moradias. Em 2026 (até outubro), houve 62 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 270767,
    abrigoId: 5,
    distanciaAbrigoKm: 6.1
  },
  {
    id: 20,
    nome: "Carrão",
    regiao: "Leste",
    subprefeitura: "Aricanduva-Formosa-Carrão",
    latitude: -23.55108,
    longitude: -46.53829,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 11 áreas de risco de alagamento ou inundação no distrito; 3 delas são de risco alto ou muito alto, com 33 moradias. Em 2026 (até outubro), houve 15 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 84397,
    abrigoId: 36,
    distanciaAbrigoKm: 0.7
  },
  {
    id: 21,
    nome: "Casa Verde",
    regiao: "Norte",
    subprefeitura: "Casa Verde-Cachoeirinha",
    latitude: -23.50099,
    longitude: -46.65744,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    noticia: "Em 10/02/2020 o CGE registrou sete pontos de alagamento intransitáveis na Casa Verde. Em 23/10/2024 houve alagamento na Rua Dr. Freire Cisneiro.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" },
      { rotulo: "Estadão, via Tribuna do Sertão (10/02/2020)", url: "https://www.tribunadosertao.com.br/geral/2020/02/10/301684-chuva-forte-provoca-77-pontos-de-alagamento-em-sp-e-interdita-marginal-tiete" },
      { rotulo: "Metrópoles (23/10/2024)", url: "https://www.metropoles.com/sao-paulo/chuva-sp-transito-pontos-alagamento" }
    ],
    populacaoEstimada: 80536,
    abrigoId: 6,
    distanciaAbrigoKm: 1.0
  },
  {
    id: 22,
    nome: "Cidade Ademar",
    regiao: "Sul",
    subprefeitura: "Cidade Ademar",
    latitude: -23.67376,
    longitude: -46.65687,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 43 áreas de risco de alagamento ou inundação no distrito; 23 delas são de risco alto ou muito alto, com 1630 moradias. Em 2026 (até outubro), houve 11 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 249218,
    abrigoId: 14,
    distanciaAbrigoKm: 2.9
  },
  {
    id: 23,
    nome: "Cidade Dutra",
    regiao: "Sul",
    subprefeitura: "Capela do Socorro",
    latitude: -23.72576,
    longitude: -46.7024,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 18 áreas de risco de alagamento ou inundação no distrito; 10 delas são de risco alto ou muito alto, com 840 moradias. Em 2026 (até outubro), houve 10 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 182459,
    abrigoId: 14,
    distanciaAbrigoKm: 4.9
  },
  {
    id: 24,
    nome: "Cidade Líder",
    regiao: "Leste",
    subprefeitura: "Itaquera",
    latitude: -23.56202,
    longitude: -46.4913,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 10 áreas de risco de alagamento ou inundação no distrito; 5 delas são de risco alto ou muito alto, com 380 moradias. Em 2026 (até outubro), houve 2 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 136660,
    abrigoId: 17,
    distanciaAbrigoKm: 1.4
  },
  {
    id: 25,
    nome: "Cidade Tiradentes",
    regiao: "Leste",
    subprefeitura: "Cidade Tiradentes",
    latitude: -23.5848,
    longitude: -46.40085,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 7 áreas de risco de alagamento ou inundação no distrito; 3 delas são de risco alto ou muito alto, com 475 moradias. Em 2026 (até outubro), houve 5 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 194177,
    abrigoId: 29,
    distanciaAbrigoKm: 1.6
  },
  {
    id: 26,
    nome: "Consolação",
    regiao: "Centro",
    subprefeitura: "Sé",
    latitude: -23.54869,
    longitude: -46.66023,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 53249,
    abrigoId: 2,
    distanciaAbrigoKm: 2.9
  },
  {
    id: 27,
    nome: "Cursino",
    regiao: "Sul",
    subprefeitura: "Ipiranga",
    latitude: -23.6312,
    longitude: -46.62069,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 12 áreas de risco de alagamento ou inundação no distrito; 3 delas são de risco alto ou muito alto, com 67 moradias. Em 2026 (até outubro), houve 12 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 103171,
    abrigoId: 33,
    distanciaAbrigoKm: 2.0
  },
  {
    id: 28,
    nome: "Ermelino Matarazzo",
    regiao: "Leste",
    subprefeitura: "Ermelino Matarazzo",
    latitude: -23.49129,
    longitude: -46.48453,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 6 áreas de risco de alagamento ou inundação no distrito; 1 delas é de risco alto ou muito alto, com 55 moradias. Em 2026 (até outubro), houve 7 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 112333,
    abrigoId: 28,
    distanciaAbrigoKm: 5.2
  },
  {
    id: 29,
    nome: "Freguesia do Ó",
    regiao: "Norte",
    subprefeitura: "Freguesia-Brasilândia",
    latitude: -23.48623,
    longitude: -46.6974,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 3 áreas de risco de alagamento ou inundação no distrito; 1 delas é de risco alto ou muito alto, com 40 moradias. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    noticia: "Em 12/09/2026 o nível do Rio Tietê subiu e ficou perto de transbordar na altura da Ponte da Freguesia do Ó.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" },
      { rotulo: "Times Brasil (12/09/2026)", url: "https://timesbrasil.com.br/brasil/temporal-causa-mortes-e-provoca-alagamentos-e-bloqueios-em-sao-paulo/" }
    ],
    populacaoEstimada: 137240,
    abrigoId: 8,
    distanciaAbrigoKm: 0.5
  },
  {
    id: 30,
    nome: "Grajaú",
    regiao: "Sul",
    subprefeitura: "Capela do Socorro",
    latitude: -23.78946,
    longitude: -46.66864,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 21 áreas de risco de alagamento ou inundação no distrito; 14 delas são de risco alto ou muito alto, com 1100 moradias. Em 2026 (até outubro), houve 22 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 384873,
    abrigoId: 14,
    distanciaAbrigoKm: 11.6
  },
  {
    id: 31,
    nome: "Guaianases",
    regiao: "Leste",
    subprefeitura: "Guaianases",
    latitude: -23.55637,
    longitude: -46.40662,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 3 áreas de risco de alagamento ou inundação no distrito; 1 delas é de risco alto ou muito alto, com 45 moradias. Em 2026 (até outubro), houve 2 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 109316,
    abrigoId: 18,
    distanciaAbrigoKm: 0.9
  },
  {
    id: 33,
    nome: "Iguatemi",
    regiao: "Leste",
    subprefeitura: "São Mateus",
    latitude: -23.61257,
    longitude: -46.42677,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 14 áreas de risco de alagamento ou inundação no distrito; 7 delas são de risco alto ou muito alto, com 177 moradias. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 149700,
    abrigoId: 29,
    distanciaAbrigoKm: 2.9
  },
  {
    id: 34,
    nome: "Ipiranga",
    regiao: "Sul",
    subprefeitura: "Ipiranga",
    latitude: -23.59181,
    longitude: -46.60283,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 2 áreas de risco de alagamento ou inundação no distrito, nenhuma de risco alto. Em 2026 (até outubro), houve 4 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 116271,
    abrigoId: 35,
    distanciaAbrigoKm: 0.7
  },
  {
    id: 35,
    nome: "Itaim Bibi",
    regiao: "Oeste",
    subprefeitura: "Pinheiros",
    latitude: -23.60211,
    longitude: -46.68536,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 1 área de risco de alagamento ou inundação no distrito, nenhuma de risco alto. Em 2026 (até outubro), houve 2 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 101452,
    abrigoId: 9,
    distanciaAbrigoKm: 3.1
  },
  {
    id: 36,
    nome: "Itaim Paulista",
    regiao: "Leste",
    subprefeitura: "Itaim Paulista",
    latitude: -23.50339,
    longitude: -46.38635,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 14 áreas de risco de alagamento ou inundação no distrito; 6 delas são de risco alto ou muito alto, com 370 moradias. Em 2026 (até outubro), houve 53 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 205295,
    abrigoId: 32,
    distanciaAbrigoKm: 3.4
  },
  {
    id: 37,
    nome: "Itaquera",
    regiao: "Leste",
    subprefeitura: "Itaquera",
    latitude: -23.53402,
    longitude: -46.45594,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 12 áreas de risco de alagamento ou inundação no distrito; 5 delas são de risco alto ou muito alto, com 290 moradias. Em 2026 (até outubro), houve 6 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 210960,
    abrigoId: 16,
    distanciaAbrigoKm: 2.4
  },
  {
    id: 38,
    nome: "Jabaquara",
    regiao: "Sul",
    subprefeitura: "Jabaquara",
    latitude: -23.65055,
    longitude: -46.64591,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 39 áreas de risco de alagamento ou inundação no distrito; 23 delas são de risco alto ou muito alto, com 1269 moradias. Em 2026 (até outubro), houve 24 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 214958,
    abrigoId: 33,
    distanciaAbrigoKm: 1.4
  },
  {
    id: 39,
    nome: "Jaçanã",
    regiao: "Norte",
    subprefeitura: "Jaçanã-Tremembé",
    latitude: -23.46214,
    longitude: -46.57494,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 4 áreas de risco de alagamento ou inundação no distrito; 1 delas é de risco alto ou muito alto, com 55 moradias. Em 2026 (até outubro), houve 8 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 87329,
    abrigoId: 12,
    distanciaAbrigoKm: 0.6
  },
  {
    id: 40,
    nome: "Jaguara",
    regiao: "Oeste",
    subprefeitura: "Lapa",
    latitude: -23.51103,
    longitude: -46.74713,
    vulnerabilidade: 1,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 24730,
    abrigoId: 19,
    distanciaAbrigoKm: 3.3
  },
  {
    id: 41,
    nome: "Jaguaré",
    regiao: "Oeste",
    subprefeitura: "Lapa",
    latitude: -23.54383,
    longitude: -46.74883,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 6 áreas de risco de alagamento ou inundação no distrito; 3 delas são de risco alto ou muito alto, com 380 moradias. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 55382,
    abrigoId: 11,
    distanciaAbrigoKm: 1.1
  },
  {
    id: 42,
    nome: "Jaraguá",
    regiao: "Norte",
    subprefeitura: "Pirituba-Jaraguá",
    latitude: -23.44575,
    longitude: -46.73978,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 28 áreas de risco de alagamento ou inundação no distrito; 15 delas são de risco alto ou muito alto, com 716 moradias. Em 2026 (até outubro), houve 4 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 211610,
    abrigoId: 7,
    distanciaAbrigoKm: 3.6
  },
  {
    id: 43,
    nome: "Jardim Ângela",
    regiao: "Sul",
    subprefeitura: "M'Boi Mirim",
    latitude: -23.71604,
    longitude: -46.76809,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 30 áreas de risco de alagamento ou inundação no distrito; 16 delas são de risco alto ou muito alto, com 1290 moradias. Em 2026 (até outubro), houve 26 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 311432,
    abrigoId: 23,
    distanciaAbrigoKm: 8.9
  },
  {
    id: 44,
    nome: "Jardim Helena",
    regiao: "Leste",
    subprefeitura: "São Miguel",
    latitude: -23.4837,
    longitude: -46.41291,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 20 áreas de risco de alagamento ou inundação no distrito; 4 delas são de risco alto ou muito alto, com 575 moradias. Em 2026 (até outubro), houve 125 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 129409,
    abrigoId: 32,
    distanciaAbrigoKm: 1.7
  },
  {
    id: 45,
    nome: "Jardim Paulista",
    regiao: "Oeste",
    subprefeitura: "Pinheiros",
    latitude: -23.56651,
    longitude: -46.66676,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 4 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 81859,
    abrigoId: 9,
    distanciaAbrigoKm: 3.7
  },
  {
    id: 46,
    nome: "Jardim São Luís",
    regiao: "Sul",
    subprefeitura: "M'Boi Mirim",
    latitude: -23.68073,
    longitude: -46.7394,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 25 áreas de risco de alagamento ou inundação no distrito; 17 delas são de risco alto ou muito alto, com 1925 moradias. Em 2026 (até outubro), houve 20 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 259377,
    abrigoId: 23,
    distanciaAbrigoKm: 4.0
  },
  {
    id: 47,
    nome: "José Bonifácio",
    regiao: "Leste",
    subprefeitura: "Itaquera",
    latitude: -23.56739,
    longitude: -46.43266,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 8 áreas de risco de alagamento ou inundação no distrito; 4 delas são de risco alto ou muito alto, com 289 moradias. Em 2026 (até outubro), houve 3 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 128243,
    abrigoId: 16,
    distanciaAbrigoKm: 2.3
  },
  {
    id: 96,
    nome: "Lajeado",
    regiao: "Leste",
    subprefeitura: "Guaianases",
    latitude: -23.53363,
    longitude: -46.40863,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 19 áreas de risco de alagamento ou inundação no distrito; 9 delas são de risco alto ou muito alto, com 496 moradias. Em 2026 (até outubro), houve 3 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 164391,
    abrigoId: 16,
    distanciaAbrigoKm: 3.2
  },
  {
    id: 48,
    nome: "Lapa",
    regiao: "Oeste",
    subprefeitura: "Lapa",
    latitude: -23.52264,
    longitude: -46.70598,
    vulnerabilidade: 1,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 75533,
    abrigoId: 19,
    distanciaAbrigoKm: 1.6
  },
  {
    id: 49,
    nome: "Liberdade",
    regiao: "Centro",
    subprefeitura: "Sé",
    latitude: -23.56695,
    longitude: -46.63196,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 66056,
    abrigoId: 1,
    distanciaAbrigoKm: 0.7
  },
  {
    id: 50,
    nome: "Limão",
    regiao: "Norte",
    subprefeitura: "Casa Verde-Cachoeirinha",
    latitude: -23.49751,
    longitude: -46.67604,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 10 áreas de risco de alagamento ou inundação no distrito; 3 delas são de risco alto ou muito alto, com 60 moradias. Em 2026 (até outubro), houve 2 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 82373,
    abrigoId: 6,
    distanciaAbrigoKm: 2.2
  },
  {
    id: 51,
    nome: "Mandaqui",
    regiao: "Norte",
    subprefeitura: "Santana-Tucuruvi",
    latitude: -23.45947,
    longitude: -46.64085,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 2 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 103665,
    abrigoId: 20,
    distanciaAbrigoKm: 1.2
  },
  {
    id: 52,
    nome: "Marsilac",
    regiao: "Sul",
    subprefeitura: "Parelheiros",
    latitude: -23.93526,
    longitude: -46.70798,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 3 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 11443,
    abrigoId: 14,
    distanciaAbrigoKm: 27.8
  },
  {
    id: 32,
    nome: "Moema",
    regiao: "Sul",
    subprefeitura: "Vila Mariana",
    latitude: -23.59611,
    longitude: -46.66137,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 2 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 81899,
    abrigoId: 9,
    distanciaAbrigoKm: 0.6
  },
  {
    id: 53,
    nome: "Mooca",
    regiao: "Leste",
    subprefeitura: "Mooca",
    latitude: -23.56135,
    longitude: -46.59641,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 1 área de risco de alagamento ou inundação no distrito, nenhuma de risco alto. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    noticia: "O CGE registrou ponto de alagamento na Av. Regente Feijó, na Mooca, em um dia de transbordamento do Córrego Mooca.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" },
      { rotulo: "Metrópoles", url: "https://www.metropoles.com/sao-paulo/chuva-estado-atencao-sp" }
    ],
    populacaoEstimada: 80880,
    abrigoId: 21,
    distanciaAbrigoKm: 1.2
  },
  {
    id: 54,
    nome: "Morumbi",
    regiao: "Oeste",
    subprefeitura: "Butantã",
    latitude: -23.59632,
    longitude: -46.70802,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 1 área de risco de alagamento ou inundação no distrito; 1 delas é de risco alto ou muito alto, com 10 moradias. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 43690,
    abrigoId: 3,
    distanciaAbrigoKm: 2.9
  },
  {
    id: 55,
    nome: "Parelheiros",
    regiao: "Sul",
    subprefeitura: "Parelheiros",
    latitude: -23.83012,
    longitude: -46.71628,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 15 áreas de risco de alagamento ou inundação no distrito; 9 delas são de risco alto ou muito alto, com 470 moradias. Em 2026 (até outubro), houve 17 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 153695,
    abrigoId: 14,
    distanciaAbrigoKm: 16.4
  },
  {
    id: 56,
    nome: "Pari",
    regiao: "Leste",
    subprefeitura: "Mooca",
    latitude: -23.52719,
    longitude: -46.61751,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 1 área de risco de alagamento ou inundação no distrito, nenhuma de risco alto. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 17359,
    abrigoId: 27,
    distanciaAbrigoKm: 1.7
  },
  {
    id: 57,
    nome: "Parque do Carmo",
    regiao: "Leste",
    subprefeitura: "Itaquera",
    latitude: -23.57598,
    longitude: -46.46298,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 8 áreas de risco de alagamento ou inundação no distrito; 6 delas são de risco alto ou muito alto, com 208 moradias. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 74677,
    abrigoId: 17,
    distanciaAbrigoKm: 3.6
  },
  {
    id: 58,
    nome: "Pedreira",
    regiao: "Sul",
    subprefeitura: "Cidade Ademar",
    latitude: -23.70694,
    longitude: -46.64987,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 20 áreas de risco de alagamento ou inundação no distrito; 12 delas são de risco alto ou muito alto, com 885 moradias. Em 2026 (até outubro), houve 13 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 163586,
    abrigoId: 14,
    distanciaAbrigoKm: 4.0
  },
  {
    id: 59,
    nome: "Penha",
    regiao: "Leste",
    subprefeitura: "Penha",
    latitude: -23.5232,
    longitude: -46.52904,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 3 áreas de risco de alagamento ou inundação no distrito; 1 delas é de risco alto ou muito alto, com 280 moradias. Em 2026 (até outubro), houve 6 ocorrências registradas de alagamento ou inundação.",
    noticia: "Em 19/01/2024 o CGE registrou ponto intransitável na região da Penha. O Córrego Franquinho já transbordou na Penha e deixou a subprefeitura em alerta.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" },
      { rotulo: "Diário do Transporte (19/01/2024)", url: "https://diariodotransporte.com.br/2024/01/19/sao-paulo-e-regiao-metropolitana-tem-multiplos-pontos-de-alagamentos-na-noite-desta-sexta-feira-19/" },
      { rotulo: "IstoÉ", url: "https://istoe.com.br/rio-transborda-e-deixa-dois-bairros-de-sao-paulo-em-estado-de-alerta" }
    ],
    populacaoEstimada: 132452,
    abrigoId: 28,
    distanciaAbrigoKm: 1.0
  },
  {
    id: 60,
    nome: "Perdizes",
    regiao: "Oeste",
    subprefeitura: "Lapa",
    latitude: -23.53872,
    longitude: -46.68093,
    vulnerabilidade: 1,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 102391,
    abrigoId: 2,
    distanciaAbrigoKm: 3.4
  },
  {
    id: 61,
    nome: "Perus",
    regiao: "Norte",
    subprefeitura: "Perus",
    latitude: -23.40792,
    longitude: -46.74614,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 11 áreas de risco de alagamento ou inundação no distrito; 6 delas são de risco alto ou muito alto, com 381 moradias. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 87723,
    abrigoId: 7,
    distanciaAbrigoKm: 1.4
  },
  {
    id: 62,
    nome: "Pinheiros",
    regiao: "Oeste",
    subprefeitura: "Pinheiros",
    latitude: -23.56647,
    longitude: -46.68867,
    vulnerabilidade: 1,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    noticia: "O CGE já registrou alagamento transitável na Rua Pedroso de Morais, na altura da Praça Panamericana.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" },
      { rotulo: "Metrópoles", url: "https://www.metropoles.com/sao-paulo/sp-atencao-alagamentos" }
    ],
    populacaoEstimada: 65145,
    abrigoId: 3,
    distanciaAbrigoKm: 3.7
  },
  {
    id: 63,
    nome: "Pirituba",
    regiao: "Norte",
    subprefeitura: "Pirituba-Jaraguá",
    latitude: -23.48095,
    longitude: -46.72618,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 10 áreas de risco de alagamento ou inundação no distrito; 5 delas são de risco alto ou muito alto, com 370 moradias. Em 2026 (até outubro), houve 3 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 179724,
    abrigoId: 22,
    distanciaAbrigoKm: 1.5
  },
  {
    id: 64,
    nome: "Ponte Rasa",
    regiao: "Leste",
    subprefeitura: "Ermelino Matarazzo",
    latitude: -23.51567,
    longitude: -46.49373,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 8 áreas de risco de alagamento ou inundação no distrito; 3 delas são de risco alto ou muito alto, com 172 moradias. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 89881,
    abrigoId: 28,
    distanciaAbrigoKm: 3.5
  },
  {
    id: 65,
    nome: "Raposo Tavares",
    regiao: "Oeste",
    subprefeitura: "Butantã",
    latitude: -23.5924,
    longitude: -46.78542,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 5 áreas de risco de alagamento ou inundação no distrito; 2 delas são de risco alto ou muito alto, com 205 moradias. Em 2026 (até outubro), houve 7 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 117738,
    abrigoId: 13,
    distanciaAbrigoKm: 3.2
  },
  {
    id: 66,
    nome: "República",
    regiao: "Centro",
    subprefeitura: "Sé",
    latitude: -23.54476,
    longitude: -46.64105,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 2 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 60720,
    abrigoId: 2,
    distanciaAbrigoKm: 2.6
  },
  {
    id: 67,
    nome: "Rio Pequeno",
    regiao: "Oeste",
    subprefeitura: "Butantã",
    latitude: -23.57123,
    longitude: -46.75894,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 13 áreas de risco de alagamento ou inundação no distrito; 8 delas são de risco alto ou muito alto, com 715 moradias. Em 2026 (até outubro), houve 10 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 131631,
    abrigoId: 11,
    distanciaAbrigoKm: 2.1
  },
  {
    id: 68,
    nome: "Sacomã",
    regiao: "Sul",
    subprefeitura: "Ipiranga",
    latitude: -23.63081,
    longitude: -46.59817,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 21 áreas de risco de alagamento ou inundação no distrito; 6 delas são de risco alto ou muito alto, com 215 moradias. Em 2026 (até outubro), houve 6 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 261436,
    abrigoId: 31,
    distanciaAbrigoKm: 3.9
  },
  {
    id: 69,
    nome: "Santa Cecília",
    regiao: "Centro",
    subprefeitura: "Sé",
    latitude: -23.5318,
    longitude: -46.65288,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 80972,
    abrigoId: 2,
    distanciaAbrigoKm: 0.9
  },
  {
    id: 70,
    nome: "Santana",
    regiao: "Norte",
    subprefeitura: "Santana-Tucuruvi",
    latitude: -23.50001,
    longitude: -46.63037,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 115689,
    abrigoId: 15,
    distanciaAbrigoKm: 1.9
  },
  {
    id: 71,
    nome: "Santo Amaro",
    regiao: "Sul",
    subprefeitura: "Santo Amaro",
    latitude: -23.64237,
    longitude: -46.7012,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    noticia: "No bairro Chácara Santo Antônio: o bairro pertence ao distrito de Santo Amaro, onde o CGE registrou ponto intransitável em 19/01/2024. A Av. Engenheiro Alberto de Zagottis alaga com frequência por causa do Córrego Zavuvus. Em 19/01/2024 o CGE registrou pontos intransitáveis na região.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" },
      { rotulo: "Diário do Transporte (19/01/2024)", url: "https://diariodotransporte.com.br/2024/01/19/sao-paulo-e-regiao-metropolitana-tem-multiplos-pontos-de-alagamentos-na-noite-desta-sexta-feira-19/" },
      { rotulo: "Câmara Municipal de São Paulo", url: "https://www.saopaulo.sp.leg.br/iah/fulltext/justificativa/JPL0092-2023.pdf" },
      { rotulo: "Gazeta de S.Paulo", url: "https://www.gazetasp.com.br/cotidiano/vereadores-cobram-solucao-em-avenida/" }
    ],
    populacaoEstimada: 85349,
    abrigoId: 23,
    distanciaAbrigoKm: 1.8
  },
  {
    id: 95,
    nome: "São Domingos",
    regiao: "Norte",
    subprefeitura: "Pirituba-Jaraguá",
    latitude: -23.49347,
    longitude: -46.74724,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 4 áreas de risco de alagamento ou inundação no distrito; 3 delas são de risco alto ou muito alto, com 228 moradias. Em 2026 (até outubro), houve 5 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 88884,
    abrigoId: 22,
    distanciaAbrigoKm: 1.7
  },
  {
    id: 72,
    nome: "São Lucas",
    regiao: "Leste",
    subprefeitura: "Vila Prudente",
    latitude: -23.59468,
    longitude: -46.54359,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 17 áreas de risco de alagamento ou inundação no distrito; 6 delas são de risco alto ou muito alto, com 210 moradias. Em 2026 (até outubro), houve 17 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 138038,
    abrigoId: 38,
    distanciaAbrigoKm: 2.8
  },
  {
    id: 73,
    nome: "São Mateus",
    regiao: "Leste",
    subprefeitura: "São Mateus",
    latitude: -23.60006,
    longitude: -46.48128,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 3 áreas de risco de alagamento ou inundação no distrito; 1 delas é de risco alto ou muito alto, com 35 moradias. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 155682,
    abrigoId: 24,
    distanciaAbrigoKm: 2.1
  },
  {
    id: 74,
    nome: "São Miguel",
    regiao: "Leste",
    subprefeitura: "São Miguel",
    latitude: -23.50108,
    longitude: -46.4408,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 15 áreas de risco de alagamento ou inundação no distrito; 10 delas são de risco alto ou muito alto, com 1535 moradias. Em 2026 (até outubro), houve 9 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 81011,
    abrigoId: 32,
    distanciaAbrigoKm: 2.2
  },
  {
    id: 75,
    nome: "São Rafael",
    regiao: "Leste",
    subprefeitura: "São Mateus",
    latitude: -23.62821,
    longitude: -46.45394,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 6 áreas de risco de alagamento ou inundação no distrito; 2 delas são de risco alto ou muito alto, com 41 moradias. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 148145,
    abrigoId: 24,
    distanciaAbrigoKm: 2.2
  },
  {
    id: 76,
    nome: "Sapopemba",
    regiao: "Leste",
    subprefeitura: "Sapopemba",
    latitude: -23.60557,
    longitude: -46.50955,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 18 áreas de risco de alagamento ou inundação no distrito; 10 delas são de risco alto ou muito alto, com 749 moradias. Em 2026 (até outubro), houve 7 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 266715,
    abrigoId: 26,
    distanciaAbrigoKm: 0.7
  },
  {
    id: 77,
    nome: "Saúde",
    regiao: "Sul",
    subprefeitura: "Vila Mariana",
    latitude: -23.61462,
    longitude: -46.64108,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 2 áreas de risco de alagamento ou inundação no distrito; 1 delas é de risco alto ou muito alto, com 57 moradias. Em 2026 (até outubro), houve 5 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 128469,
    abrigoId: 9,
    distanciaAbrigoKm: 2.4
  },
  {
    id: 78,
    nome: "Sé",
    regiao: "Centro",
    subprefeitura: "Sé",
    latitude: -23.54771,
    longitude: -46.63145,
    vulnerabilidade: 1,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 23832,
    abrigoId: 4,
    distanciaAbrigoKm: 2.6
  },
  {
    id: 79,
    nome: "Socorro",
    regiao: "Sul",
    subprefeitura: "Capela do Socorro",
    latitude: -23.68528,
    longitude: -46.71372,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 2 áreas de risco de alagamento ou inundação no distrito, nenhuma de risco alto. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 38051,
    abrigoId: 14,
    distanciaAbrigoKm: 3.2
  },
  {
    id: 80,
    nome: "Tatuapé",
    regiao: "Leste",
    subprefeitura: "Mooca",
    latitude: -23.53868,
    longitude: -46.56745,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 6 áreas de risco de alagamento ou inundação no distrito; 2 delas são de risco alto ou muito alto, com 35 moradias. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 98601,
    abrigoId: 25,
    distanciaAbrigoKm: 0.4
  },
  {
    id: 81,
    nome: "Tremembé",
    regiao: "Norte",
    subprefeitura: "Jaçanã-Tremembé",
    latitude: -23.41747,
    longitude: -46.58921,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 10 áreas de risco de alagamento ou inundação no distrito; 3 delas são de risco alto ou muito alto, com 575 moradias. Em 2026 (até outubro), houve 3 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 196563,
    abrigoId: 12,
    distanciaAbrigoKm: 5.6
  },
  {
    id: 82,
    nome: "Tucuruvi",
    regiao: "Norte",
    subprefeitura: "Santana-Tucuruvi",
    latitude: -23.4757,
    longitude: -46.60604,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 3 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 99559,
    abrigoId: 15,
    distanciaAbrigoKm: 2.2
  },
  {
    id: 83,
    nome: "Vila Andrade",
    regiao: "Sul",
    subprefeitura: "Campo Limpo",
    latitude: -23.62623,
    longitude: -46.72828,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 14 áreas de risco de alagamento ou inundação no distrito; 7 delas são de risco alto ou muito alto, com 560 moradias. Em 2026 (até outubro), houve 3 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 168669,
    abrigoId: 5,
    distanciaAbrigoKm: 2.7
  },
  {
    id: 84,
    nome: "Vila Curuçá",
    regiao: "Leste",
    subprefeitura: "Itaim Paulista",
    latitude: -23.51,
    longitude: -46.41565,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 8 áreas de risco de alagamento ou inundação no distrito; 3 delas são de risco alto ou muito alto, com 495 moradias. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 140673,
    abrigoId: 32,
    distanciaAbrigoKm: 1.3
  },
  {
    id: 85,
    nome: "Vila Formosa",
    regiao: "Leste",
    subprefeitura: "Aricanduva-Formosa-Carrão",
    latitude: -23.56786,
    longitude: -46.54599,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 1 área de risco de alagamento ou inundação no distrito, nenhuma de risco alto. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 92186,
    abrigoId: 40,
    distanciaAbrigoKm: 1.5
  },
  {
    id: 86,
    nome: "Vila Guilherme",
    regiao: "Norte",
    subprefeitura: "Vila Maria-Vila Guilherme",
    latitude: -23.50918,
    longitude: -46.60577,
    vulnerabilidade: 2,
    historico: "A Prefeitura não mapeou áreas de risco de alagamento ou inundação no distrito. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 52587,
    abrigoId: 34,
    distanciaAbrigoKm: 0.6
  },
  {
    id: 87,
    nome: "Vila Jacuí",
    regiao: "Leste",
    subprefeitura: "São Miguel",
    latitude: -23.50262,
    longitude: -46.46156,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 21 áreas de risco de alagamento ou inundação no distrito; 8 delas são de risco alto ou muito alto, com 1355 moradias. Em 2026 (até outubro), houve 5 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 134189,
    abrigoId: 32,
    distanciaAbrigoKm: 4.4
  },
  {
    id: 88,
    nome: "Vila Leopoldina",
    regiao: "Oeste",
    subprefeitura: "Lapa",
    latitude: -23.52927,
    longitude: -46.73437,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 1 área de risco de alagamento ou inundação no distrito; 1 delas é de risco alto ou muito alto, com 200 moradias. Em 2026 (até outubro), não houve ocorrência de alagamento ou inundação registrada.",
    noticia: "Em fevereiro de 2020 o Rio Pinheiros extravasou para dentro da Ceagesp e alagou a Av. Gastão Vidigal. A bacia da Vila Leopoldina tem inundações frequentes.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" },
      { rotulo: "Artigo da USP sobre a Bacia da Vila Leopoldina", url: "https://repositorio.usp.br/bitstreams/870562cc-cc0b-47e9-b296-af75c240c826" }
    ],
    populacaoEstimada: 46875,
    abrigoId: 19,
    distanciaAbrigoKm: 1.5
  },
  {
    id: 89,
    nome: "Vila Maria",
    regiao: "Norte",
    subprefeitura: "Vila Maria-Vila Guilherme",
    latitude: -23.51304,
    longitude: -46.57779,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 2 áreas de risco de alagamento ou inundação no distrito; 1 delas é de risco alto ou muito alto, com 70 moradias. Em 2026 (até outubro), houve 6 ocorrências registradas de alagamento ou inundação.",
    noticia: "Em 23/10/2024 um trecho da Av. Zaki Narchi ficou intransitável. Em janeiro de 2025 a região de Vila Maria/Vila Guilherme registrou 104,4 mm de chuva, com alagamentos.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" },
      { rotulo: "Metrópoles (23/10/2024)", url: "https://www.metropoles.com/sao-paulo/chuva-sp-transito-pontos-alagamento" },
      { rotulo: "O Povo (jan/2025)", url: "https://mais.opovo.com.br/jornal/farol/2025/01/25/sao-paulo-tem-ruas-e-estacao-do-metro-alagadas-apos-fortes-chuvas.html" }
    ],
    populacaoEstimada: 108543,
    abrigoId: 37,
    distanciaAbrigoKm: 1.4
  },
  {
    id: 90,
    nome: "Vila Mariana",
    regiao: "Sul",
    subprefeitura: "Vila Mariana",
    latitude: -23.5865,
    longitude: -46.6358,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 3 áreas de risco de alagamento ou inundação no distrito, nenhuma de risco alto. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 127286,
    abrigoId: 1,
    distanciaAbrigoKm: 1.8
  },
  {
    id: 91,
    nome: "Vila Matilde",
    regiao: "Leste",
    subprefeitura: "Penha",
    latitude: -23.53936,
    longitude: -46.51788,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 3 áreas de risco de alagamento ou inundação no distrito, nenhuma de risco alto. Em 2026 (até outubro), houve 3 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 103558,
    abrigoId: 36,
    distanciaAbrigoKm: 1.7
  },
  {
    id: 92,
    nome: "Vila Medeiros",
    regiao: "Norte",
    subprefeitura: "Vila Maria-Vila Guilherme",
    latitude: -23.48874,
    longitude: -46.57762,
    vulnerabilidade: 2,
    historico: "A Prefeitura mapeou 3 áreas de risco de alagamento ou inundação no distrito; 2 delas são de risco alto ou muito alto, com 120 moradias. Em 2026 (até outubro), houve 2 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 114939,
    abrigoId: 37,
    distanciaAbrigoKm: 1.4
  },
  {
    id: 93,
    nome: "Vila Prudente",
    regiao: "Leste",
    subprefeitura: "Vila Prudente",
    latitude: -23.5925,
    longitude: -46.57275,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 7 áreas de risco de alagamento ou inundação no distrito; 2 delas são de risco alto ou muito alto, com 370 moradias. Em 2026 (até outubro), houve 1 ocorrência registrada de alagamento ou inundação.",
    noticia: "Em 08/03/2026 o Córrego Mooca extravasou no cruzamento das avenidas Vila Ema e Salim Farah Maluf. Em 19/01/2024 o CGE já havia registrado iminência de transbordamento no mesmo ponto.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" },
      { rotulo: "Band (08/03/2026)", url: "https://www.band.com.br/noticias/sp-entra-em-estado-de-atencao-apos-forte-chuva-corregos-transbordam-202603081620" },
      { rotulo: "Diário do Transporte (19/01/2024)", url: "https://diariodotransporte.com.br/2024/01/19/sao-paulo-e-regiao-metropolitana-tem-multiplos-pontos-de-alagamentos-na-noite-desta-sexta-feira-19/" }
    ],
    populacaoEstimada: 105690,
    abrigoId: 38,
    distanciaAbrigoKm: 1.1
  },
  {
    id: 94,
    nome: "Vila Sônia",
    regiao: "Oeste",
    subprefeitura: "Butantã",
    latitude: -23.59944,
    longitude: -46.73923,
    vulnerabilidade: 3,
    historico: "A Prefeitura mapeou 5 áreas de risco de alagamento ou inundação no distrito; 3 delas são de risco alto ou muito alto, com 300 moradias. Em 2026 (até outubro), houve 7 ocorrências registradas de alagamento ou inundação.",
    fontes: [
      { rotulo: "GeoSampa (Prefeitura de SP)", url: "https://geosampa.prefeitura.sp.gov.br/" }
    ],
    populacaoEstimada: 123748,
    abrigoId: 13,
    distanciaAbrigoKm: 1.5
  }
];

function buscarBairro(id) {
  return BAIRROS.find(bairro => bairro.id === Number(id));
}

function buscarAbrigo(bairro) {
  return ABRIGOS.find(abrigo => abrigo.id === bairro.abrigoId);
}

// "Zona Leste", "Centro"...
function nomeDaRegiao(regiao) {
  return regiao === "Centro" ? "Centro" : "Zona " + regiao;
}

// Opções de um <select>, agrupadas por região; "lista" (opcional) limita os bairros
function preencherSelectBairros(select, lista) {
  const bairros = lista || BAIRROS;
  let html = "";
  for (const regiao of REGIOES) {
    const daRegiao = bairros.filter(bairro => bairro.regiao === regiao);
    if (daRegiao.length === 0) continue;
    html += `<optgroup label="${nomeDaRegiao(regiao)}">`;
    for (const bairro of daRegiao) {
      html += `<option value="${bairro.id}">${bairro.nome}</option>`;
    }
    html += "</optgroup>";
  }
  // Mantém as opções do HTML (ex.: "Escolha seu bairro")
  select.querySelectorAll("optgroup").forEach(grupo => grupo.remove());
  select.insertAdjacentHTML("beforeend", html);
}
