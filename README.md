# Clima Safe

Grupo QuickStart · Global Solution 2

Site no ar: https://anubes0.github.io/clima-safe/

## Descrição

Quem mora em bairros de São Paulo sujeitos a alagamentos costuma descobrir o problema quando a água já chegou, sem saber para onde ir. O Clima Safe cruza a previsão de chuva da Open-Meteo com o risco de alagamento dos 96 distritos oficiais da cidade de São Paulo, calculado com base em dados da Prefeitura.

A plataforma apresenta o nível de alerta (INMET), as orientações sobre o que fazer e o ponto de apoio público mais próximo. O distrito pode ser localizado por meio da localização do dispositivo (com a permissão do usuário), pela busca do nome ou pela seleção no mapa interativo, que também exibe os 39 municípios da Grande São Paulo.

Os outros 38 municípios da região também podem ser selecionados, mas recebem alertas baseados exclusivamente na previsão de chuva. Além disso, o morador pode realizar um cadastro para receber alertas referentes ao seu distrito.

O Clima Safe não substitui os alertas oficiais da Defesa Civil. O projeto contribui para os Objetivos de Desenvolvimento Sustentável (ODS) 11 (Cidades e Comunidades Sustentáveis) e 13 (Ação Contra a Mudança Global do Clima).

## Como abrir e executar na sua máquina

1. Baixe o arquivo .zip do GitHub.
2. Extraia o conteúdo para a pasta de sua preferência.
3. Entre na pasta extraída, `clima-safe-main`, e abra o arquivo `index.html` com um duplo clique.
4. Escolha seu navegador de preferência para executar a página.

> **Observação:** Apenas a previsão real depende de conexão com a internet. Sem conexão, a página Simulador continua funcionando normalmente, recalculando os alertas dos distritos e do mapa sem consultar a API.

## Páginas

| Página | Conteúdo |
|---|---|
| `index.html` | Apresentação do projeto, problema, dados reais e suas fontes, funcionamento da solução e ODS 11 e 13. |
| `solucao.html` | Previsão real da Open-Meteo, atualizada a cada 10 minutos, mapa da Grande São Paulo em SVG com zoom, dados e previsões. |
| `simulador.html` | Simulador de chuva com controle de 0 a 100 mm/h, fixado no topo durante a rolagem em computadores. Recalcula o mapa e o painel do distrito sem conexão com a internet. |
| `cadastro.html` | Formulário de cadastro para recebimento de alertas e explicação sobre o funcionamento dos avisos. |
| `impacto.html` | Indicadores, gráficos em SVG sobre o risco por região e a população exposta, simulação de cadastros por distrito, próximos passos, ODS 11 e 13 e integrantes do projeto. |
| `equipe.html` | Apresentação dos integrantes e informações sobre o projeto. |

## Estrutura do projeto

```text
clima-safe/
├── index.html, solucao.html, simulador.html, cadastro.html, impacto.html, equipe.html
├── README.md
├── css/
│   └── style.css        # Arquivo de estilo
├── js/
│   ├── estado.js        # Tamanho do texto, contraste, distrito ou cidade escolhidos, cadastros e alertas
│   ├── dados.js         # Dados dos 96 distritos e dos 40 pontos de apoio, gerados a partir de bases da Prefeitura
│   ├── api.js           # Previsão da Open-Meteo: 24 horas de todos os locais em uma chamada e 7 dias do local escolhido
│   ├── campo-bairro.js  # Campo de seleção do distrito
│   ├── simulacao.js     # Regras de alerta, painel e cartões
│   ├── localizacao.js   # Identificação do distrito por meio da localização
│   ├── mapa-dados.js    # Contornos dos 39 municípios (IBGE) e dos 96 distritos da capital (GeoSampa)
│   ├── mapa.js          # Mapa em SVG
│   ├── formulario.js    # Validação do cadastro
│   ├── impacto.js       # Indicadores e gráficos da página Impacto
│   ├── fonte.js         # Botões A-, A+ e Alto Contraste
│   ├── menu.js          # Menu para dispositivos móveis
│   └── topo.js          # Botão "Topo", no canto inferior esquerdo
└── img/
    └── logo.svg, hero.svg, avatar-placeholder.svg
```

## Regra de alerta

| Nível | Chuva por hora | Chuva em 24 horas |
|---|---|---|
| Verde (sem alerta) | Menos de 20 mm/h | Menos de 50 mm |
| Amarelo (perigo potencial) | De 20 a menos de 30 mm/h | Não define |
| Laranja (perigo) | De 30 a 60 mm/h | De 50 a 100 mm |
| Vermelho (grande perigo) | Mais de 60 mm/h | Mais de 100 mm |

## Risco de cada distrito (vulnerabilidade)

A classificação utiliza duas bases da Prefeitura disponíveis no GeoSampa: as 793 áreas de risco de alagamento e inundação mapeadas e os registros de ocorrências de alagamento e inundação até a metade de 2026.

- **Alto (3):** pelo menos 300 moradias em áreas R3 ou R4, ou pelo menos 10 ocorrências em 2026 — 33 distritos.
- **Médio (2):** presença de alguma área de risco ou registro de ocorrência — 54 distritos.
- **Baixo (1):** nenhuma área de risco identificada e nenhuma ocorrência registrada — 9 distritos. Isso não significa que nunca ocorram alagamentos nesses locais.

## Tecnologias

HTML5, CSS3 (Flexbox, Grid e Media Queries), JavaScript (DOM, eventos, fetch com async/await, localStorage e Geolocation API) e SVG para o mapa.

O projeto não utiliza frameworks nem bibliotecas externas. As fontes de dados são as APIs da Open-Meteo e do IBGE, além das bases do GeoSampa, utilizadas em `js/dados.js` e `js/mapa-dados.js`.

## Acessibilidade

- HTML semântico, com um único h1 por página.
- Contraste de texto de pelo menos 4,5:1. Os níveis de alerta são sempre apresentados por escrito, nunca apenas por cores.
- Campo de seleção do distrito com suporte à navegação pelo teclado: digitar filtra a lista, as setas percorrem as opções, Enter seleciona e Esc cancela.
- Botões A- e A+ para ajustar o tamanho do texto e botão Alto Contraste para ativar a visualização em preto e branco.
- Botão "Topo", no canto inferior esquerdo, para retornar ao início da página.
- Gráficos em SVG, presentes na página Impacto e no painel do simulador, com descrições textuais para leitores de tela e valores apresentados por escrito.

## Fontes dos dados

- IBGE e CEMADEN, População em áreas de risco no Brasil (2018): https://agenciadenoticias.ibge.gov.br/agencia-sala-de-imprensa/21565-em-2010-brasil-tinha-8-3-milhoes-de-pessoas-morando-em-areas-com-risco-de-desastres-naturais.html
- Página do estudo no IBGE: https://www.ibge.gov.br/geociencias/informacoes-ambientais/estudos-ambientais/21538-populacao-em-areas-de-risco-no-brasil.html
- Open-Meteo: https://open-meteo.com
- INMET: https://www.cnnbrasil.com.br/nacional/chuva-entenda-os-alertas-do-inmet-para-temporais/
- Prefeitura de São Paulo — Censo 2022 por distrito: https://prefeitura.sp.gov.br/web/subprefeituras/w/munic%C3%ADpio-de-s%C3%A3o-paulo-subprefeituras-e-distritos-municipais-1
- GeoSampa — Prefeitura de São Paulo: https://geosampa.prefeitura.sp.gov.br
- Prefeitura de São Paulo — Centros Esportivos: https://prefeitura.sp.gov.br/web/esportes/w/centros_esportivos/8001
- IBGE — Documentação da API: https://servicodados.ibge.gov.br/api/docs
- Defesa Civil: https://prefeitura.sp.gov.br/web/aricanduva/w/noticias/98571

## Notícias de alagamentos citadas em alguns distritos

| Distrito | Fonte |
|---|---|
| Mooca | Metrópoles: https://www.metropoles.com/sao-paulo/chuva-estado-atencao-sp |
| Vila Prudente | Band: https://www.band.com.br/noticias/sp-entra-em-estado-de-atencao-apos-forte-chuva-corregos-transbordam-202603081620 |
| Belém (bairro Belenzinho) | Estadão: https://www.tribunadosertao.com.br/brasil/2014/01/25/151503-chuva-faz-rio-tiete-transbordar-na-zona-leste-de-sp |
| Casa Verde | Estadão: https://www.tribunadosertao.com.br/geral/2020/02/10/301684-chuva-forte-provoca-77-pontos-de-alagamento-em-sp-e-interdita-marginal-tiete |
| Vila Leopoldina | Artigo da USP: https://repositorio.usp.br/bitstreams/870562cc-cc0b-47e9-b296-af75c240c826 |
| Pinheiros | Metrópoles: https://www.metropoles.com/sao-paulo/sp-atencao-alagamentos |
| Santo Amaro (bairro Chácara Santo Antônio) | Diário do Transporte · Câmara Municipal de São Paulo: https://www.saopaulo.sp.leg.br/iah/fulltext/justificativa/JPL0092-2023.pdf |
| Penha | Diário do Transporte: https://istoe.com.br/rio-transborda-e-deixa-dois-bairros-de-sao-paulo-em-estado-de-alerta |
| Freguesia do Ó | Times Brasil: https://timesbrasil.com.br/brasil/temporal-causa-mortes-e-provoca-alagamentos-e-bloqueios-em-sao-paulo/ |
| Vila Maria | Metrópoles: https://www.metropoles.com/sao-paulo/chuva-sp-transito-pontos-alagamento |
| Santo Amaro | Diário do Transporte · Gazeta de S.Paulo: https://www.gazetasp.com.br/cotidiano/vereadores-cobram-solucao-em-avenida/ |

## Limitações conhecidas

- **Pontos de apoio:** são Centros Esportivos da Prefeitura utilizados como referência. A base possui 40 unidades, das quais 39 são as mais próximas de pelo menos um distrito (número apresentado na página Impacto). Não são abrigos oficiais confirmados e sua capacidade é desconhecida. A unidade indicada para cada distrito é a mais próxima de seu centro geográfico, em linha reta, com distância máxima de 27,8 km (em Marsilac). Apenas 10 possuem telefone. O site orienta o usuário a confirmar informações com a Defesa Civil (199).
- **Divisão territorial:** os 96 "bairros" considerados pelo projeto são, na realidade, os distritos oficiais da capital. Bairros menores estão incluídos nesses distritos, como Belenzinho, em Belém, e Chácara Santo Antônio, em Santo Amaro.
- **Outros municípios:** nas outras 38 cidades da Grande São Paulo, os alertas consideram apenas a previsão de chuva. Como o mapeamento de risco por distrito está disponível somente para a capital, o site não indica pontos de apoio com certeza e orienta o usuário a consultar a Defesa Civil (199).
- **Localização:** só é solicitada quando o usuário clica em "Usar minha localização", momento em que o navegador pede autorização. As coordenadas são utilizadas apenas na página para identificar o distrito, sem serem armazenadas ou enviadas. Fora da capital, o site identifica o município da Grande São Paulo em que o usuário está.
- **Cadastros e alertas:** os indicadores representam apenas as interações realizadas no próprio site. Nenhum dado é enviado para servidores externos. O navegador armazena somente a quantidade de cadastros realizados por distrito durante a sessão.
- **Armazenamento local:** ao abrir o site diretamente de arquivos locais, alguns navegadores, como o Firefox, não permitem que as páginas compartilhem o localStorage. Por isso, o tamanho do texto e as contagens também são transmitidos entre as páginas pelos parâmetros dos links (por exemplo, `impacto.html?fonte=2&cadastros=5:1...`).
- **API Open-Meteo:** a versão gratuita possui limite de utilização. Se a previsão real falhar ou demorar mais de 10 segundos, o site exibe um aviso.
- **Compartilhamento:** os botões "Como chegar" e "Compartilhar no WhatsApp" abrem o Google Maps e o WhatsApp, respectivamente, somente quando acionados pelo usuário. Nenhuma informação é enviada automaticamente. Quando há chuva simulada, a mensagem começa com "SIMULAÇÃO (não é alerta real)".
- **Previsões:** os gráficos das próximas 24 horas e dos próximos 7 dias são exibidos somente quando há dados da previsão real, na página Solução.
- **Atualização da previsão:** a página Solução consulta a Open-Meteo ao ser aberta e mantém o resultado armazenado por 10 minutos na sessão do navegador, evitando chamadas repetidas.
- **Cadastro:** é um protótipo. Nenhum alerta é enviado de verdade. Após o cadastro, o site orienta o usuário a utilizar o serviço de SMS da Defesa Civil.

## Integrantes

| Nome | RM |
|---|---|
| Mateus Bomfim Nascimento | A preencher |
| Pedro Henrique da Silva Valandro | A preencher |
| Lucas Paz dos Santos Lima | A preencher |
| João Pedro Soares Rocha | A preencher |
| Gabriel Rocha Freitas | A preencher |

## Pitch

Link do vídeo: A preencher
