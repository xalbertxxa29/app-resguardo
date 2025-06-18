document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const backBtn = document.getElementById("back-btn");
  const pdfViewer = document.getElementById("pdf-viewer");
  const pdfCanvas = document.getElementById("pdf-canvas");
  
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const pageNumSpan = document.getElementById("page-num");
  const pageCountSpan = document.getElementById("page-count");

  const zoomBtn = document.getElementById("zoom-btn");

  const url = 'ejercicios.pdf';

  let pdfDoc = null;
  let pageNum = 1;
  let pageRendering = false;
  let pageNumPending = null;
  
  let scaleFit = 1.0; // Escala para ajustar al ancho
  let scaleZoomed = 2.0; // Nivel de zoom al presionar el botón
  let isZoomed = false;

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
          renderPage(pageNumPending, isZoomed ? scaleZoomed : scaleFit);
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
      renderPage(num, isZoomed ? scaleZoomed : scaleFit);
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

  zoomBtn.addEventListener('click', () => {
    isZoomed = !isZoomed; // Alterna el estado del zoom
    renderPage(pageNum, isZoomed ? scaleZoomed : scaleFit);
  });
  
  backBtn.addEventListener("click", () => {
    window.location.href = "menu.html";
  });

  // Carga inicial del documento
  pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    pageCountSpan.textContent = pdfDoc.numPages;

    // Calcula la escala inicial para que se ajuste al ancho del contenedor
    return pdfDoc.getPage(1);
  }).then(page => {
      const viewport = page.getViewport({ scale: 1.0 });
      scaleFit = pdfViewer.clientWidth / viewport.width;
      renderPage(pageNum, scaleFit); // Renderiza la primera página con la escala ajustada
  }).catch(err => {
    console.error("Error al cargar el PDF:", err);
    loader.textContent = "Error al cargar PDF.";
  });
});