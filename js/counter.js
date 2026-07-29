/* =============================================================
   counter.js — Contadores animados
   Uso: <strong class="cifra-num" data-hasta="8">0</strong>
   Se activan al entrar en pantalla; no requiere librerías.
   ============================================================= */
(function () {
  "use strict";

  var cifras = document.querySelectorAll(".cifra-num");
  if (!cifras.length) return;

  var animarCifra = function (elemento) {
    var hasta = parseInt(elemento.getAttribute("data-hasta"), 10) || 0;
    var duracion = 1400;
    var inicio = null;

    var paso = function (marca) {
      if (!inicio) inicio = marca;
      var progreso = Math.min((marca - inicio) / duracion, 1);
      var facilitado = 1 - Math.pow(1 - progreso, 3); /* ease-out cubic */
      elemento.textContent = Math.floor(facilitado * hasta);
      if (progreso < 1) {
        window.requestAnimationFrame(paso);
      } else {
        elemento.textContent = hasta;
      }
    };
    window.requestAnimationFrame(paso);
  };

  if ("IntersectionObserver" in window) {
    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            animarCifra(entrada.target);
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    cifras.forEach(function (c) {
      observador.observe(c);
    });
  } else {
    cifras.forEach(function (c) {
      c.textContent = c.getAttribute("data-hasta");
    });
  }
})();
