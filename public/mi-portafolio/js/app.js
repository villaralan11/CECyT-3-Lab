"use strict";

const root = document.documentElement;
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navegacion-principal");
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeIcon = document.querySelector(".theme-icon");
const contactForm = document.querySelector("#formulario-contacto");
const formStatus = document.querySelector("#estado-formulario");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function applyTheme(theme) {
  const isLight = theme === "light";
  root.dataset.theme = isLight ? "light" : "dark";
  document.querySelector('meta[name="theme-color"]').setAttribute("content", isLight ? "#f5f5f7" : "#000000");
  themeToggle.setAttribute("aria-label", `Cambiar a tema ${isLight ? "oscuro" : "claro"}`);
  themeLabel.textContent = `Tema ${isLight ? "oscuro" : "claro"}`;
  themeIcon.textContent = isLight ? "☾" : "☼";
}

try {
  const savedTheme = window.localStorage.getItem("alan-portfolio-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme);
  }
} catch (error) {
  console.error("No se pudo leer la preferencia de tema guardada.", error);
}

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme);

  try {
    window.localStorage.setItem("alan-portfolio-theme", nextTheme);
  } catch (error) {
    console.error("No se pudo guardar la preferencia de tema.", error);
  }
});

function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");
  navigation.classList.toggle("is-open", isOpen);
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navigation.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("a")) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${targetId}`);
    target.focus({ preventScroll: true });
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  if (!contactForm.reportValidity()) {
    return;
  }

  formStatus.textContent =
    "Los datos son válidos. El formulario aún no puede enviar mensajes porque no está conectado a un servicio de envío.";
});
