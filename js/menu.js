// Botão "Menu" do celular.

const botaoMenu = document.getElementById("botao-menu");
const menu = document.getElementById("menu-principal");

botaoMenu.addEventListener("click", function () {
  const aberto = menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", aberto);
});

// Fecha e devolve o foco ao botão
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && menu.classList.contains("aberto")) {
    menu.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.focus();
  }
});
