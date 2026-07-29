/* =============================================================
   main.js — Comportamiento base del portal (todas las páginas)
   Sin librerías externas. ES6. Sin localStorage (ver nota abajo).
   ============================================================= */
(function () {
  "use strict";

  /* ---------- 1. Menú móvil ---------- */
  var btnMenu = document.getElementById("btnMenu");
  var navPrincipal = document.getElementById("navPrincipal");

  if (btnMenu && navPrincipal) {
    btnMenu.addEventListener("click", function () {
      var abierto = navPrincipal.classList.toggle("abierto");
      btnMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
    navPrincipal.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        navPrincipal.classList.remove("abierto");
        btnMenu.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 2. Header flotante al hacer scroll ---------- */
  var header = document.getElementById("headerPrincipal");
  if (header) {
    var alternarHeader = function () {
      if (window.scrollY > 40) {
        header.classList.add("flotante");
      } else {
        header.classList.remove("flotante");
      }
    };
    alternarHeader();
    window.addEventListener("scroll", alternarHeader, { passive: true });
  }

  /* ---------- 3. Modo oscuro opcional ----------
     Nota: no usamos localStorage/sessionStorage a propósito
     (algunos entornos de previsualización los bloquean).
     El tema se mantiene solo durante la sesión de navegación
     mediante el atributo data-tema en <html>. Si más adelante
     se aloja el sitio en un hosting propio, se puede añadir
     persistencia con localStorage sin ningún problema. */
  var btnTema = document.getElementById("btnTema");
  if (btnTema) {
    btnTema.addEventListener("click", function () {
      var raiz = document.documentElement;
      var actual = raiz.getAttribute("data-tema");
      raiz.setAttribute("data-tema", actual === "oscuro" ? "claro" : "oscuro");
    });
  }

  /* ---------- 4. Scroll reveal (Intersection Observer) ---------- */
  var elementosRevelar = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && elementosRevelar.length) {
    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );
    elementosRevelar.forEach(function (el) {
      observador.observe(el);
    });
  } else {
    elementosRevelar.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- 5. Modal de video (YouTube vía iframe) ----------
     Uso: <button data-video="ID_DE_YOUTUBE">Ver video</button>
     Reemplazar ID_DE_YOUTUBE por el identificador real del video. */
  var modal = document.getElementById("modalVideo");
  if (modal) {
    var caja = modal.querySelector(".caja");
    var btnCerrar = modal.querySelector(".cerrar");

    var abrirModal = function (idYoutube) {
      caja.innerHTML =
        '<iframe src="https://www.youtube.com/embed/' +
        idYoutube +
        '?autoplay=1&rel=0" title="Video institucional Chacayán" ' +
        'frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
        '<button class="cerrar" aria-label="Cerrar video">&times;</button>';
      caja.querySelector(".cerrar").addEventListener("click", cerrarModal);
      modal.classList.add("abierto");
      document.body.style.overflow = "hidden";
    };

    var cerrarModal = function () {
      modal.classList.remove("abierto");
      caja.innerHTML = "";
      document.body.style.overflow = "";
    };

    document.querySelectorAll("[data-video]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        abrirModal(btn.getAttribute("data-video"));
      });
    });
    if (btnCerrar) btnCerrar.addEventListener("click", cerrarModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) cerrarModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrarModal();
    });
  }

  /* ---------- 6. Parallax ligero en ilustraciones de fondo ---------- */
  var capasParallax = document.querySelectorAll(".parallax-capa");
  if (capasParallax.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        capasParallax.forEach(function (capa) {
          var velocidad = parseFloat(capa.getAttribute("data-velocidad")) || 0.15;
          capa.style.transform = "translateY(" + y * velocidad + "px)";
        });
      },
      { passive: true }
    );
  }
})();
