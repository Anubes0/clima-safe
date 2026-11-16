// topo.js — o botão "Topo" do canto inferior esquerdo aparece depois que a página desce um pouco.
// Sem JavaScript ele fica sempre visível.

const botaoTopo = document.getElementById("voltar-topo");

function mostrarOuEsconderTopo() {
  botaoTopo.classList.toggle("escondido", window.scrollY < 400);
}

window.addEventListener("scroll", mostrarOuEsconderTopo);
mostrarOuEsconderTopo();
