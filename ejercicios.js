document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const backBtn = document.getElementById("back-btn");
  const pdfCanvas = document.getElementById("pdf-canvas");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const pageNumSpan = document.getElementById("page-num");
  const pageCountSpan = document.getElementById("page-count");

  // URL correcta de tu PDF en Firebase
  const url = 'https://firebasestorage.googleapis.com/v0/b/resguardo-b4d86.firebasestorage.app/o/ejercicios.pdf?alt=media&token=7838baff-6380-44d0-a3f2-7c7f9e6a62ec';

  let pdfDoc = null;
  let pageNum = 1;
  let pageRendering = false;
  let pageNumPending = null;

  const renderPage = num => {
    pageRendering = true;
    loader.style.display = 'block'; // Muestra el loader

    pdfDoc.getPage(num).then(page => {
      const viewport = page.getViewport({ scale: 1.5 });
      pdfCanvas.height = viewport.height;
      pdfCanvas.width = viewport.width;

      const renderContext = {
        canvasContext: pdfCanvas.getContext('2d'),
        viewport: viewport
      };

      page.render(renderContext).promise.then(() => {
        pageRendering = false;
        loader.style.display = 'none'; // Oculta el loader

        if (pageNumPending !== null) {
          renderPage(pageNumPending);
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
      renderPage(num);
    }
  };

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

  // Carga el documento PDF
  pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    pageCountSpan.textContent = pdfDoc.numPages;
    renderPage(pageNum);
  }).catch(err => {
    console.error("Error al cargar el PDF:", err);
    loader.textContent = "Error al cargar PDF.";
  });
  
  backBtn.addEventListener("click", () => {
    window.location.href = "menu.html";
  });
});