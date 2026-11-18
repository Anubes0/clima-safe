// O botão "Topo" aparece depois de rolar a página.

const botaoTopo = document.getElementById("voltar-topo");

function mostrarOuEsconderTopo() {
  botaoTopo.classList.toggle("escondido", window.scrollY < 400);
}

window.addEventListener("scroll", mostrarOuEsconderTopo);
mostrarOuEsconderTopo();
