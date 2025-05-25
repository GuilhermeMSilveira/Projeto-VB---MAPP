import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";

// Configura o worker para o worker interno do pdfjs-dist (resolve erro 404)
GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.js", import.meta.url).toString();

/**
 * Extrai texto do PDF VB-MAPP localizado na pasta public/assets.
 * @returns {Promise<string>} - Texto extraído do PDF.
 */
export async function extractTextFromVBMAPP() {
  try {
    const loadingTask = getDocument("/assets/VB_MAPP.pdf"); // caminho público da pasta public
    const pdf = await loadingTask.promise;

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    return fullText;
  } catch (error) {
    console.error("Erro ao extrair texto do PDF:", error);
    throw error;
  }
}
