// Campo para escolher o bairro da capital ou outra cidade da Grande SP.
// Digitar filtra a lista; a seta mostra todos, separados por região.
// Padrão combobox do W3C: setas movimentam, Enter escolhe, Esc cancela.

const caixaBairro = document.getElementById("caixa-bairro");
const campoBairro = document.getElementById("campo-bairro");
const botaoListaBairro = document.getElementById("botao-lista-bairro");
const listaOpcoesBairro = document.getElementById("opcoes-bairro");
const avisoBairro = document.getElementById("aviso-bairro");

// Bairros da capital e os outros 38 municípios, numa lista só.
// chave: "b" + id do bairro, ou "m" + posição em OUTROS_MUNICIPIOS (mapa.js)
const GRUPO_MUNICIPIOS = "Outras cidades da Grande SP";
const GRUPOS = REGIOES.map(nomeDaRegiao).concat([GRUPO_MUNICIPIOS]);
const LUGARES = BAIRROS
  .map(bairro => ({ chave: "b" + bairro.id, nome: bairro.nome, grupo: nomeDaRegiao(bairro.regiao) }))
  .concat(OUTROS_MUNICIPIOS.map((municipio, i) => ({ chave: "m" + i, nome: municipio.nome, grupo: GRUPO_MUNICIPIOS })));

let opcoesVisiveis = [];       // lugares da lista aberta, na ordem da tela
let opcaoAtiva = -1;           // posição da opção destacada
let ultimoPonteiro = "mouse";  // "touch" no celular

// "sao" acha "São Miguel"
function semAcento(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function lugarComONome(texto) {
  const procurado = semAcento(texto.trim());
  return LUGARES.find(lugar => semAcento(lugar.nome) === procurado);
}

// Chamada por simulacao.js a cada escolha
function mostrarNoCampo(nome) {
  campoBairro.value = nome;
}

// ---------- Lista ----------

function listaAberta() {
  return !listaOpcoesBairro.hidden;
}

function abrirLista(lugares, chaveDestacada) {
  opcoesVisiveis = [];
  let html = "";
  GRUPOS.forEach(function (grupo, g) {
    const doGrupo = lugares
      .filter(lugar => lugar.grupo === grupo)
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    if (doGrupo.length === 0) return;
    html += `<ul role="group" aria-labelledby="grupo-lugares-${g}">
      <li role="presentation" class="titulo-grupo" id="grupo-lugares-${g}">${grupo}</li>`;
    for (const lugar of doGrupo) {
      const escolhido = lugar.chave === chaveDoEscolhido() ? " escolhida" : "";   // simulacao.js
      html += `<li role="option" class="opcao-bairro${escolhido}" id="opcao-${lugar.chave}" data-chave="${lugar.chave}" aria-selected="false">${lugar.nome}</li>`;
      opcoesVisiveis.push(lugar);
    }
    html += "</ul>";
  });
  listaOpcoesBairro.innerHTML = html;
  listaOpcoesBairro.hidden = false;
  campoBairro.setAttribute("aria-expanded", "true");
  botaoListaBairro.setAttribute("aria-expanded", "true");

  const posicao = opcoesVisiveis.findIndex(lugar => lugar.chave === chaveDestacada);
  destacarOpcao(posicao === -1 ? 0 : posicao);
}

function abrirListaToda() {
  abrirLista(LUGARES, chaveDoEscolhido());
}

function fecharLista() {
  listaOpcoesBairro.hidden = true;
  campoBairro.setAttribute("aria-expanded", "false");
  botaoListaBairro.setAttribute("aria-expanded", "false");
  campoBairro.removeAttribute("aria-activedescendant");
  opcaoAtiva = -1;
  avisoBairro.textContent = "";
}

// O foco fica no campo; aria-activedescendant indica a opção ao leitor de tela
function destacarOpcao(posicao) {
  const anterior = listaOpcoesBairro.querySelector('[aria-selected="true"]');
  if (anterior) anterior.setAttribute("aria-selected", "false");

  opcaoAtiva = posicao;
  const opcao = document.getElementById("opcao-" + opcoesVisiveis[posicao].chave);
  opcao.setAttribute("aria-selected", "true");
  campoBairro.setAttribute("aria-activedescendant", opcao.id);

  // Rola só a lista; na 1ª opção do grupo, mostra o título junto
  const lista = listaOpcoesBairro;
  const titulo = opcao.previousElementSibling;
  const topo = titulo && titulo.classList.contains("titulo-grupo") ? titulo.offsetTop : opcao.offsetTop;
  if (topo < lista.scrollTop) {
    lista.scrollTop = topo;
  } else if (opcao.offsetTop + opcao.offsetHeight > lista.scrollTop + lista.clientHeight) {
    lista.scrollTop = opcao.offsetTop + opcao.offsetHeight - lista.clientHeight;
  }
}

// Escolhe o bairro ou a cidade (simulacao.js)
function escolherLugar(lugar) {
  if (lugar.chave === chaveDoEscolhido()) {
    mostrarNoCampo(lugar.nome);
  } else if (lugar.chave.startsWith("b")) {
    escolherBairro(Number(lugar.chave.slice(1)));
  } else {
    escolherMunicipio(Number(lugar.chave.slice(1)));
  }
}

function escolherOpcao(posicao) {
  const lugar = opcoesVisiveis[posicao];
  fecharLista();
  escolherLugar(lugar);
}

function desistirDaBusca() {
  fecharLista();
  mostrarNoCampo(nomeDoLugarEscolhido());   // simulacao.js
}

// Ao sair do campo: nome exato escolhe o lugar; texto incompleto é desfeito
function sairDoCampo() {
  const lugar = lugarComONome(campoBairro.value);
  if (lugar) {
    fecharLista();
    escolherLugar(lugar);
  } else {
    desistirDaBusca();
  }
}

// ---------- Eventos ----------

campoBairro.addEventListener("input", function () {
  const texto = semAcento(campoBairro.value.trim());
  if (texto === "") {
    abrirListaToda();
    avisoBairro.textContent = "";
    return;
  }
  const encontrados = LUGARES.filter(lugar => semAcento(lugar.nome).includes(texto));
  if (encontrados.length === 0) {
    fecharLista();
    avisoBairro.textContent = "Nenhum bairro ou cidade com esse nome. Confira a escrita ou escolha no mapa.";
    return;
  }
  // Destaca o nome exato ou o que começa com o texto (Enter escolhe)
  const melhor = encontrados.find(lugar => semAcento(lugar.nome) === texto)
    || encontrados.find(lugar => semAcento(lugar.nome).startsWith(texto))
    || encontrados.find(lugar => (" " + semAcento(lugar.nome)).includes(" " + texto));
  abrirLista(encontrados, melhor ? melhor.chave : null);
  avisoBairro.textContent = encontrados.length === 1 ? "1 resultado." : encontrados.length + " resultados.";
});

campoBairro.addEventListener("keydown", function (evento) {
  if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
    evento.preventDefault();
    if (!listaAberta()) {
      abrirListaToda();
      return;
    }
    let posicao = opcaoAtiva + (evento.key === "ArrowDown" ? 1 : -1);
    if (posicao < 0) posicao = opcoesVisiveis.length - 1;
    if (posicao >= opcoesVisiveis.length) posicao = 0;
    destacarOpcao(posicao);
  } else if (evento.key === "Enter" && listaAberta()) {
    evento.preventDefault();
    escolherOpcao(opcaoAtiva);
  } else if (evento.key === "Escape") {
    desistirDaBusca();
  }
});

// Clique abre a lista e seleciona o texto (digitar substitui)
campoBairro.addEventListener("click", function () {
  if (listaAberta()) return;
  campoBairro.select();
  abrirListaToda();
});

campoBairro.addEventListener("blur", sairDoCampo);

caixaBairro.addEventListener("pointerdown", function (evento) {
  ultimoPonteiro = evento.pointerType;
});

// mousedown cancelado: o campo não perde o foco ao clicar na seta ou na lista
botaoListaBairro.addEventListener("mousedown", evento => evento.preventDefault());
botaoListaBairro.addEventListener("click", function () {
  if (listaAberta()) {
    desistirDaBusca();
    return;
  }
  abrirListaToda();
  if (ultimoPonteiro !== "touch") campoBairro.focus();   // no celular, sem abrir o teclado
});

listaOpcoesBairro.addEventListener("mousedown", evento => evento.preventDefault());
listaOpcoesBairro.addEventListener("click", function (evento) {
  const opcao = evento.target.closest('[role="option"]');
  if (!opcao) return;
  escolherOpcao(opcoesVisiveis.findIndex(lugar => lugar.chave === opcao.dataset.chave));
  if (ultimoPonteiro === "touch") campoBairro.blur();    // fecha o teclado do celular
});

// Clique fora fecha a lista
document.addEventListener("pointerdown", function (evento) {
  if (listaAberta() && !caixaBairro.contains(evento.target)) sairDoCampo();
});
