document.addEventListener("DOMContentLoaded", () => {
    const loader   = document.getElementById("loader");
    const pdfFrame = document.getElementById("pdf-frame");
    const backBtn  = document.getElementById("back-btn");
  
    // Cuando el iframe termine de cargar el PDF, ocultamos el loader y mostramos el iframe
    pdfFrame.addEventListener("load", () => {
      loader.style.display = "none";
      pdfFrame.style.opacity = "1";
    });
  
    // Botón Atrás vuelve al menú
    backBtn.addEventListener("click", () => {
      window.location.href = "menu.html";
    });
  });
  