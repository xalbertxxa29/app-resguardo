document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const backBtn = document.getElementById("back-btn");
  const pdfCanvas = document.getElementById("pdf-canvas");
  
  // Controles de Paginación
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const pageNumSpan = document.getElementById("page-num");
  const pageCountSpan = document.getElementById("page-count");

  // Controles de Zoom
  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");

  const url = 'ejercicios.pdf';

  let pdfDoc = null;
  let pageNum = 1;
  let pageRendering = false;
  let pageNumPending = null;
  let currentScale = 1.5; // Escala de zoom inicial

  const renderPage = (num, scale) => {
    pageRendering = true;
    loader.style.display = 'block';

    pdfDoc.getPage(num).then(page => {
      const viewport = page.getViewport({ scale: scale });
      pdfCanvas.height = viewport.height;
      pdfCanvas.width = viewport.width;

      const renderContext = {
        canvasContext: pdfCanvas.getContext('2d'),
        viewport: viewport
      };

      page.render(renderContext).promise.then(() => {
        pageRendering = false;
        loader.style.display = 'none';

        if (pageNumPending !== null) {
          renderPage(pageNumPending, currentScale);
          pageNumPending = null;
        }
      });
    });

    pageNumSpan.textContent = num;
  };

  const queueRenderPage = num => {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num, currentScale);
    }
  };

  // --- Event Listeners ---

  prevPageBtn.addEventListener('click', () => {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
  });

  nextPageBtn.addEventListener('click', () => {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
  });

  zoomInBtn.addEventListener('click', () => {
    currentScale += 0.2;
    renderPage(pageNum, currentScale);
  });

  zoomOutBtn.addEventListener('click', () => {
    if (currentScale <= 0.4) return; // Evita que el zoom sea demasiado pequeño
    currentScale -= 0.2;
    renderPage(pageNum, currentScale);
  });
  
  backBtn.addEventListener("click", () => {
    window.location.href = "menu.html";
  });

  // Carga inicial del documento
  pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    pageCountSpan.textContent = pdfDoc.numPages;
    renderPage(pageNum, currentScale);
  }).catch(err => {
    console.error("Error al cargar el PDF:", err);
    loader.textContent = "Error al cargar PDF.";
  });
});