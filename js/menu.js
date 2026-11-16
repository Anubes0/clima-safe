// menu.js — no celular, o botão "Menu" mostra e esconde a lista de páginas.

// Sem JavaScript o menu fica sempre aberto; com JavaScript, começa fechado no celular.
document.documentElement.classList.add("js");

const botaoMenu = document.getElementById("botao-menu");
const menu = document.getElementById("menu-principal");

botaoMenu.addEventListener("click", function () {
  const aberto = menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", aberto);
});

// Esc fecha o menu e devolve o foco para o botão
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && menu.classList.contains("aberto")) {
    menu.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.focus();
  }
});
