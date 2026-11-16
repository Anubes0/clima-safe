# Clima Safe

Grupo **QuickStart** · Global Solution 2026 · CitizenTech (FIAP)

**Site no ar:** https://anubes0.github.io/clima-safe/

## Descrição

Quem mora em bairro de São Paulo que alaga costuma descobrir o problema quando a água já chegou, sem saber para onde ir. O Clima Safe cruza a previsão de chuva da Open-Meteo com o risco de alagamento dos 96 bairros (distritos oficiais) da cidade de São Paulo, calculado com dados da Prefeitura. Ele mostra o nível de alerta (verde, amarelo, laranja ou vermelho, pelas faixas do INMET), o que fazer e o ponto de apoio público mais próximo. O bairro pode ser achado pela localização do aparelho (com a permissão do usuário), pelo nome ou clicando no mapa interativo, que também mostra os 39 municípios da Grande São Paulo. O morador também pode se cadastrar para receber o alerta do seu bairro. O Clima Safe não substitui o alerta oficial da Defesa Civil (SMS 40199): explica o que a chuva prevista significa para o bairro e para onde ir. O projeto atende aos ODS 11 (Cidades e comunidades sustentáveis) e 13 (Ação contra a mudança global do clima).

## Como abrir e executar

1. Baixe ou descompacte a pasta.
2. Abra o arquivo `index.html` no navegador (duplo clique). Não precisa instalar nada nem rodar servidor.
3. Só a previsão real usa a internet. Sem internet, use o controle "Simular chuva" da página Solução: ele recalcula os alertas dos bairros e do mapa sem chamar a API.

## Páginas

| Página | Conteúdo |
| --- | --- |
| `index.html` | Cidadão, problema com dado real e fonte, como funciona, ODS |
| `solucao.html` | Simulador (bairro, previsão real, chuva simulada), botão "Usar minha localização", busca por nome, mapa da Grande São Paulo em SVG com zoom, cards dos 96 bairros separados por região, com filtros de região, risco e nível e ordenação, regras do cálculo |
| `impacto.html` | Indicadores, como o impacto cresce, contribuição para os ODS 11 e 13, ecossistema |
| `equipe.html` | Integrantes e formulário de cadastro para alertas |

## Estrutura do projeto

```
clima-safe/
├── index.html, solucao.html, impacto.html, equipe.html
├── README.md
├── css/
│   └── style.css        # único arquivo de estilo
├── js/
│   ├── estado.js        # tamanho do texto, cadastros e alertas, levados de uma página para outra
│   ├── dados.js         # array dos 96 bairros e dos 40 pontos de apoio (gerado das bases da Prefeitura)
│   ├── api.js           # previsão da Open-Meteo (todos os lugares numa só chamada)
│   ├── simulacao.js     # regra de alerta, painel e cards (página Solução)
│   ├── localizacao.js   # "Usar minha localização": acha o bairro pelo contorno dos distritos
│   ├── mapa-dados.js    # contornos: 39 municípios (IBGE) e 96 bairros da capital (GeoSampa)
│   ├── mapa.js          # mapa em SVG
│   ├── formulario.js    # validação do cadastro
│   ├── impacto.js       # indicadores da página Impacto
│   ├── fonte.js         # botões A− e A+ (tamanho do texto)
│   ├── menu.js          # menu no celular
│   └── topo.js          # botão "Topo" do canto inferior esquerdo
└── img/
    └── logo.svg, hero.svg, avatar-placeholder.svg
```

## Regra de alerta

| Nível | Chuva por hora | Chuva no dia |
| --- | --- | --- |
| Verde (sem alerta) | menos de 20 mm/h | menos de 50 mm |
| Amarelo (perigo potencial) | 20 a menos de 30 mm/h | não define |
| Laranja (perigo) | 30 a 60 mm/h | 50 a 100 mm |
| Vermelho (grande perigo) | mais de 60 mm/h | mais de 100 mm |

Nos limites exatos vale o nível mais alto. Nos bairros, a vulnerabilidade ajusta o nível só quando já há alerta: vulnerabilidade 3 sobe um nível, 2 mantém e 1 desce um nível (nunca abaixo de verde). No mapa, a cor dos municípios em volta da capital usa só a chuva, porque o risco foi levantado apenas para os bairros da capital. Na simulação, a chuva de cada município varia entre 0,6 e 1,4 vez o valor do controle, sorteada ao abrir a página, para o mapa não ficar todo da mesma cor.

### Risco de cada bairro (vulnerabilidade)

Vem de duas bases da Prefeitura no GeoSampa: as 793 áreas de risco de alagamento e inundação mapeadas (grau R1 a R4, com o número de moradias) e as ocorrências de alagamento e inundação registradas em 2026 (até outubro).

- **Alto (3):** pelo menos 300 moradias em áreas R3 ou R4, ou pelo menos 10 ocorrências em 2026 — 33 bairros.
- **Médio (2):** alguma área de risco ou alguma ocorrência — 54 bairros.
- **Baixo (1):** nenhuma área de risco e nenhuma ocorrência — 9 bairros (não quer dizer que nunca alague).

## Tecnologias

HTML5, CSS3 (flexbox, grid, media queries), JavaScript (DOM, eventos, `fetch` com `async`/`await`, `localStorage`, Geolocation API) e SVG para o mapa. Sem frameworks nem bibliotecas. Dados: API Open-Meteo (previsão), IBGE (contornos dos municípios) e GeoSampa (bairros, risco e pontos de apoio), já copiados para `js/dados.js` e `js/mapa-dados.js`.

## Acessibilidade

- HTML semântico, um `h1` por página, link "Pular para o conteúdo" e `aria-current` no menu.
- Todo campo tem `label`; o grupo de rádio usa `fieldset` e `legend`; erros ligados ao campo com `aria-describedby` e `aria-invalid`.
- Contraste do texto de pelo menos 4,5:1; o nível de alerta sempre aparece escrito, nunca só pela cor.
- Tudo funciona pelo teclado, inclusive o mapa: Tab passa pelos municípios e bairros e mostra a etiqueta com nome, sub-região e coordenadas; Enter mostra a chuva e o que fazer.
- Botões A− e A+ no topo mudam o tamanho do texto em todas as páginas.
- Botão "Topo" no canto inferior esquerdo para voltar ao início da página.

## Fontes dos dados

- IBGE e CEMADEN, *População em áreas de risco no Brasil* (2018), com base no Censo 2010: https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/21565-em-2010-brasil-tinha-8-3-milhoes-de-pessoas-morando-em-areas-com-risco-de-desastres-naturais.html
- Página do estudo no IBGE: https://www.ibge.gov.br/geociencias/informacoes-ambientais/estudos-ambientais/21538-populacao-em-areas-de-risco-no-brasil.html
- Open-Meteo (previsão de chuva): https://open-meteo.com
- INMET, faixas de alerta de chuva (resumo da CNN Brasil): https://www.cnnbrasil.com.br/nacional/chuva-entenda-os-alertas-do-inmet-para-temporais/
- Defesa Civil de São Paulo, 21 mortes em temporais entre dezembro de 2025 e 9 de março de 2026 (noticiado pelo Metrópoles)
- Prefeitura de São Paulo, Censo 2022 por distrito: https://prefeitura.sp.gov.br/web/subprefeituras/w/munic%C3%ADpio-de-s%C3%A3o-paulo-subprefeituras-e-distritos-municipais-1
- GeoSampa, Prefeitura de São Paulo (https://geosampa.prefeitura.sp.gov.br), camadas `distrito_municipal`, `subprefeitura`, `risco_hidrologico`, `risco_ocorrencia_alagamento`, `risco_ocorrencia_inundacao` e `equipamento_esporte_centro_esportivo`, baixadas pelo serviço WFS em 16/11/2026
- Prefeitura de São Paulo, Centros Esportivos da SEME (telefones): https://prefeitura.sp.gov.br/web/esportes/w/centros_esportivos/8001
- IBGE, municípios da Região Metropolitana de São Paulo e contornos municipais: https://servicodados.ibge.gov.br/api/docs
- Defesa Civil, alerta por SMS 40199 (cadastro pelo CEP): https://prefeitura.sp.gov.br/web/aricanduva/w/noticias/98571

### Notícias de alagamento citadas em alguns bairros

| Bairro | Fonte |
| --- | --- |
| Mooca | Metrópoles: https://www.metropoles.com/sao-paulo/chuva-estado-atencao-sp |
| Vila Prudente | Band (08/03/2026): https://www.band.com.br/noticias/sp-entra-em-estado-de-atencao-apos-forte-chuva-corregos-transbordam-202603081620 · Diário do Transporte (19/01/2024) |
| Belém (bairro Belenzinho) | Estadão, via Tribuna do Sertão (24/01/2014): https://www.tribunadosertao.com.br/brasil/2014/01/25/151503-chuva-faz-rio-tiete-transbordar-na-zona-leste-de-sp |
| Casa Verde | Estadão, via Tribuna do Sertão (10/02/2020): https://www.tribunadosertao.com.br/geral/2020/02/10/301684-chuva-forte-provoca-77-pontos-de-alagamento-em-sp-e-interdita-marginal-tiete · Metrópoles (23/10/2024) |
| Vila Leopoldina | Artigo da USP sobre a Bacia da Vila Leopoldina: https://repositorio.usp.br/bitstreams/870562cc-cc0b-47e9-b296-af75c240c826 |
| Pinheiros | Metrópoles: https://www.metropoles.com/sao-paulo/sp-atencao-alagamentos |
| Santo Amaro (bairro Chácara Santo Antônio) | Diário do Transporte (19/01/2024) · Câmara Municipal de São Paulo: https://www.saopaulo.sp.leg.br/iah/fulltext/justificativa/JPL0092-2023.pdf |
| Penha | Diário do Transporte (19/01/2024) · IstoÉ: https://istoe.com.br/rio-transborda-e-deixa-dois-bairros-de-sao-paulo-em-estado-de-alerta |
| Freguesia do Ó | Times Brasil (12/09/2026): https://timesbrasil.com.br/brasil/temporal-causa-mortes-e-provoca-alagamentos-e-bloqueios-em-sao-paulo/ |
| Vila Maria | Metrópoles (23/10/2024): https://www.metropoles.com/sao-paulo/chuva-sp-transito-pontos-alagamento · O Povo (jan/2025): https://mais.opovo.com.br/jornal/farol/2025/01/25/sao-paulo-tem-ruas-e-estacao-do-metro-alagadas-apos-fortes-chuvas.html |
| Santo Amaro | Diário do Transporte (19/01/2024) · Gazeta de S.Paulo: https://www.gazetasp.com.br/cotidiano/vereadores-cobram-solucao-em-avenida/ |

Diário do Transporte (19/01/2024): https://diariodotransporte.com.br/2024/01/19/sao-paulo-e-regiao-metropolitana-tem-multiplos-pontos-de-alagamentos-na-noite-desta-sexta-feira-19/

## Limitações conhecidas

- Os pontos de apoio são 40 Centros Esportivos da Prefeitura usados como referência. Não são abrigos oficiais confirmados e a capacidade não é conhecida. O de cada bairro é o mais próximo do centro do distrito em linha reta (até 27,8 km, em Marsilac). Só 10 têm telefone. O site orienta a confirmar com a Defesa Civil (199).
- Os "bairros" são os 96 distritos oficiais da cidade. Bairros menores aparecem dentro do distrito (por exemplo, Belenzinho em Belém e Chácara Santo Antônio em Santo Amaro).
- A previsão real busca 134 lugares (96 bairros e 38 municípios) numa só chamada; para a Open-Meteo, isso conta como 134 consultas.
- A localização só é pedida quando a pessoa clica em "Usar minha localização", e o navegador pede a permissão. As coordenadas são usadas só na página, para achar o distrito (teste do ponto dentro do contorno do GeoSampa), e não são guardadas nem enviadas. Em computador sem GPS a posição pode errar por alguns quilômetros; nesse caso o site avisa para conferir o bairro. Fora da capital, o site mostra o município da Grande São Paulo no mapa.
- Os indicadores de cadastros e alertas contam o que foi feito no site. Nenhum dado sai do computador: o site guarda só quantas pessoas se cadastraram em cada bairro.
- Com o site aberto direto do arquivo, alguns navegadores (como o Firefox) não deixam as páginas dividirem o `localStorage`. Por isso o tamanho do texto e as contagens também passam de uma página para outra no endereço dos links (`impacto.html?fonte=2&cadastros=5:1...`).
- A Open-Meteo gratuita tem limite de uso. Se a previsão real falhar ou demorar mais de 10 segundos, o site avisa e o simulador continua funcionando.
- O cadastro é um protótipo: nenhum alerta é enviado de verdade. Depois do cadastro, o site indica o SMS 40199 da Defesa Civil.

## Integrantes

| Nome | RM |
| --- | --- |
| Mateus Bomfim Nascimento | a preencher |
| Pedro Henrique da Silva Valandro | a preencher |
| Lucas Paz dos Santos Lima | a preencher |
| João Pedro Soares Rocha | a preencher |
| Gabriel Rocha Freitas | a preencher |

## Pitch

Link do vídeo: a preencher
