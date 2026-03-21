const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const fileInput = document.getElementById("fileInput");

/* ================= EVENTS ================= */
document.getElementById("updateBtn").onclick = renderPreview;
document.getElementById("pdfBtn").onclick = generatePDF;
document.getElementById("importBtn").onclick = () => fileInput.click();

fileInput.addEventListener("change", handleFile);

/* ================= STORAGE ================= */
editor.value = localStorage.getItem("chart") || "";

editor.addEventListener("input", () => {
  localStorage.setItem("chart", editor.value);
});

/* ================= CLEAN ================= */
function cleanText(text) {
  return text.replace(/[^\x00-\x7F\n]/g, "").trim();
}

/* ================= PREVIEW ================= */
function renderPreview() {
  const text = cleanText(editor.value);
  preview.innerHTML = "";

  const lines = text.split("\n");

  lines.forEach(line => {
    if (line.startsWith(":")) {
      const el = document.createElement("div");
      el.className = "section";
      el.textContent = line.replace(":", "").trim();
      preview.appendChild(el);
    } else {
      const el = document.createElement("div");
      el.className = "line";

      line.split(" ").forEach(chord => {
        if (chord.trim()) {
          const span = document.createElement("span");
          span.className = "chord";
          span.textContent = chord;
          el.appendChild(span);
        }
      });

      preview.appendChild(el);
    }
  });
}

/* ================= PDF RENDER (CHORDSHEET STYLE) ================= */
function renderPDFLayout() {
  const container = document.getElementById("pdf-container");
  container.innerHTML = "";

  const text = cleanText(editor.value);
  const lines = text.split("\n");

  lines.forEach(line => {

    if (line.startsWith(":")) {
      const el = document.createElement("div");
      el.className = "pdf-section";
      el.textContent = line.replace(":", "").trim();
      container.appendChild(el);
      return;
    }

    const el = document.createElement("div");
    el.className = "pdf-line";

    const chords = line.trim().split(/\s+/);

    let formattedLine = "";

    chords.forEach((chord, index) => {
      formattedLine += chord;

      if (index < chords.length - 1) {
        formattedLine += "     "; // 🔥 ajuste fino aqui
      }
    });

    el.textContent = formattedLine;
    container.appendChild(el);
  });

  return container;
}

/* ================= PDF ================= */
function generatePDF() {
  const element = renderPDFLayout();

  const opt = {
    margin: 0,
    filename: "cifra.pdf",
    html2canvas: {
      scale: 3,
      useCORS: true
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    }
  };

  html2pdf().set(opt).from(element).save();
}

/* ================= IMPORT ================= */
function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (evt) => {
    editor.value = evt.target.result;
    renderPreview();
  };

  reader.readAsText(file);
}

/* ================= INIT ================= */
renderPreview();
