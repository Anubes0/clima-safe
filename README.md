# Clima Safe

Grupo **QuickStart** · Global Solution 2026 · CitizenTech (FIAP)

**Site no ar:** https://anubes0.github.io/clima-safe/

## Descrição

Quem mora em bairro de São Paulo que alaga costuma descobrir o problema quando a água já chegou, sem saber para onde ir. O Clima Safe cruza a previsão de chuva da Open-Meteo com o risco de alagamento dos 96 bairros (distritos oficiais) da cidade de São Paulo, calculado com dados da Prefeitura. Ele mostra o nível de alerta (verde, amarelo, laranja ou vermelho, pelas faixas do INMET), o que fazer e o ponto de apoio público mais próximo. O bairro pode ser achado pela localização do aparelho (com a permissão do usuário), pelo nome ou clicando no mapa interativo, que também mostra os 39 municípios da Grande São Paulo. As outras 38 cidades da Grande São Paulo também podem ser escolhidas, com o alerta só pela chuva. O morador também pode se cadastrar para receber o alerta do seu bairro. O Clima Safe não substitui o alerta oficial da Defesa Civil (SMS 40199): explica o que a chuva prevista significa para o bairro e para onde ir. O projeto atende aos ODS 11 (Cidades e comunidades sustentáveis) e 13 (Ação contra a mudança global do clima).

## Como abrir e executar

1. Baixe ou descompacte a pasta.
2. Abra o arquivo `index.html` no navegador (duplo clique). Não precisa instalar nada nem rodar servidor.
3. Só a previsão real (página Solução) usa a internet. Sem internet, use a página Simulador: ela recalcula os alertas dos bairros e do mapa sem chamar a API.

## Páginas

| Página | Conteúdo |
| --- | --- |
| `index.html` | Cidadão, problema com dado real e fonte, como funciona, ODS 11 e 13 (no topo) |
| `solucao.html` | Previsão real: busca a previsão da Open-Meteo ao abrir (guardada por 10 minutos) e mostra o mapa da Grande São Paulo em SVG com zoom e, ao lado, "Seu bairro" (campo único para digitar ou escolher o bairro ou uma das outras 38 cidades da Grande SP, "Usar minha localização" e o painel com gráfico das próximas 24 h, lista do que fazer em cada nível de alerta, ponto de apoio com o botão "Como chegar", "Receber alertas deste bairro" e "Compartilhar no WhatsApp"); os próximos 7 dias do lugar escolhido, embaixo do mapa; bairro escolhido em destaque e lista recolhível dos 96 bairros, com filtros; regras do cálculo |
| `simulador.html` | Simulador de chuva: o controle (0 a 100 mm/h), que fica preso no topo ao rolar no computador, recalcula o mapa e o painel do bairro sem usar a internet |
| `cadastro.html` | Formulário de cadastro para alertas (já vem com o bairro escolhido no simulador) e como funciona o aviso |
| `impacto.html` | Cartões de números, gráficos em SVG do risco por região e dos moradores por risco, uso do protótipo com cadastros por bairro, próximos passos, ODS 11 e 13 e quem faz parte |
| `equipe.html` | Integrantes e sobre o projeto |

## Estrutura do projeto

```
clima-safe/
├── index.html, solucao.html, simulador.html, cadastro.html, impacto.html, equipe.html
├── README.md
├── css/
│   └── style.css        # único arquivo de estilo
├── js/
│   ├── estado.js        # tamanho do texto, contraste, bairro ou cidade escolhidos, cadastros e alertas, levados de uma página para outra (no `<head>`, para o texto e o contraste não piscarem)
│   ├── dados.js         # array dos 96 bairros e dos 40 pontos de apoio (gerado das bases da Prefeitura)
│   ├── api.js           # previsão da Open-Meteo: 24 h de todos os lugares numa só chamada e 7 dias do lugar escolhido
│   ├── campo-bairro.js  # campo único do bairro: digitar filtra, a seta mostra todos
│   ├── simulacao.js     # regra de alerta, painel e cards (Solução: previsão real; Simulador: chuva do controle)
│   ├── localizacao.js   # "Usar minha localização": acha o bairro pelo contorno dos distritos
│   ├── mapa-dados.js    # contornos: 39 municípios (IBGE) e 96 bairros da capital (GeoSampa)
│   ├── mapa.js          # mapa em SVG
│   ├── formulario.js    # validação do cadastro
│   ├── impacto.js       # indicadores e gráficos da página Impacto
│   ├── fonte.js         # botões A-, A+ (tamanho do texto) e Alto contraste
│   ├── menu.js          # menu no celular
│   └── topo.js          # botão "Topo" do canto inferior esquerdo
└── img/
    └── logo.svg, hero.svg, avatar-placeholder.svg
```

## Regra de alerta

| Nível | Chuva por hora | Chuva em 24 h |
| --- | --- | --- |
| Verde (sem alerta) | menos de 20 mm/h | menos de 50 mm |
| Amarelo (perigo potencial) | 20 a menos de 30 mm/h | não define |
| Laranja (perigo) | 30 a 60 mm/h | 50 a 100 mm |
| Vermelho (grande perigo) | mais de 60 mm/h | mais de 100 mm |

As duas colunas valem para as próximas 24 horas, a partir da hora atual. A Open-Meteo dá a chuva de cada hora como a soma da hora anterior (o valor de 15:00 é a chuva das 14h às 15h); o site mostra cada hora pelo começo dela, como em "pico das 15h às 16h". Nos limites, 20, 30 e 50 já contam no nível de cima; 60 mm/h e 100 mm ainda são laranja (o vermelho é acima disso, como no INMET). Nos bairros, a vulnerabilidade ajusta o nível só quando já há alerta: vulnerabilidade 3 sobe um nível, 2 mantém e 1 desce um nível (nunca abaixo de verde). No mapa, a cor dos municípios em volta da capital usa só a chuva, porque o risco foi levantado apenas para os bairros da capital. Na simulação, a chuva de cada município varia entre 0,6 e 1,4 vez o valor do controle, sorteada ao abrir a página, para o mapa não ficar todo da mesma cor.

Nos próximos 7 dias (só na Solução), a mesma regra vale para cada dia: a hora mais chuvosa e o total do dia, com o ajuste do bairro. Hoje conta só as horas que faltam, e a partir do quarto dia a previsão é tendência.

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
- O campo do bairro segue o padrão combobox do W3C: digitar filtra a lista, as setas percorrem, Enter escolhe e Esc cancela.
- Botões A- e A+ no topo mudam o tamanho do texto, e o botão "Alto contraste" deixa o site em preto no branco, em todas as páginas.
- Botão "Topo" no canto inferior esquerdo (no celular, só a seta) para voltar ao início da página.
- Os gráficos em SVG (página Impacto e painel do simulador) têm descrição em texto para o leitor de tela, e os valores também aparecem escritos.

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

- Os pontos de apoio são Centros Esportivos da Prefeitura usados como referência: a base tem 40, e 39 deles são o mais próximo de algum bairro (é o número que a página Impacto mostra). Não são abrigos oficiais confirmados e a capacidade não é conhecida. O de cada bairro é o mais próximo do centro do distrito em linha reta (até 27,8 km, em Marsilac). Só 10 têm telefone. O site orienta a confirmar com a Defesa Civil (199).
- Os "bairros" são os 96 distritos oficiais da cidade. Bairros menores aparecem dentro do distrito (por exemplo, Belenzinho em Belém e Chácara Santo Antônio em Santo Amaro).
- Nas outras 38 cidades da Grande São Paulo, o nível vem só da chuva (o risco de alagamento por bairro é só da capital) e o site não indica ponto de apoio: orienta a perguntar à Defesa Civil (199).
- A previsão real busca 134 lugares (96 bairros e 38 municípios) numa só chamada; para a Open-Meteo, isso conta como 134 consultas. Os próximos 7 dias vêm de outra chamada, só do lugar escolhido, guardada por 30 minutos.
- A localização só é pedida quando a pessoa clica em "Usar minha localização", e o navegador pede a permissão. As coordenadas são usadas só na página, para achar o distrito (teste do ponto dentro do contorno do GeoSampa), e não são guardadas nem enviadas. Em computador sem GPS a posição pode errar por alguns quilômetros; nesse caso o site avisa para conferir o bairro. Fora da capital, o site escolhe a cidade da Grande São Paulo onde a pessoa está.
- Os indicadores de cadastros e alertas contam o que foi feito no site. Nenhum dado sai do computador: o site guarda só quantas pessoas se cadastraram em cada bairro.
- Com o site aberto direto do arquivo, alguns navegadores (como o Firefox) não deixam as páginas dividirem o `localStorage`. Por isso o tamanho do texto e as contagens também passam de uma página para outra no endereço dos links (`impacto.html?fonte=2&cadastros=5:1...`).
- A Open-Meteo gratuita tem limite de uso. Se a previsão real falhar ou demorar mais de 10 segundos, o site avisa e o simulador continua funcionando.
- "Como chegar" abre o Google Maps e "Compartilhar no WhatsApp" abre o WhatsApp, só quando a pessoa clica: o site não envia nada sozinho. Com a chuva simulada, a mensagem começa com "SIMULAÇÃO (não é alerta real)".
- O gráfico das próximas 24 horas e os próximos 7 dias só aparecem com a previsão real (página Solução). A partir do quarto dia, a previsão é tendência: os modelos globais usados pela Open-Meteo têm pontos de 10 a 25 km, e a chuva forte de verão em São Paulo costuma ser bem localizada.
- A página Solução busca a previsão ao abrir e guarda o resultado por 10 minutos na sessão do navegador, para não repetir a chamada a cada página.
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
