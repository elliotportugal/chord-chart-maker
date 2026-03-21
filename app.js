const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const fileInput = document.getElementById("fileInput");

document.getElementById("updateBtn").onclick = render;
document.getElementById("pdfBtn").onclick = generatePDF;
document.getElementById("importBtn").onclick = () => fileInput.click();

fileInput.addEventListener("change", handleFile);

/* LOAD LOCAL */
editor.value = localStorage.getItem("chart") || "";

/* AUTO SAVE */
editor.addEventListener("input", () => {
  localStorage.setItem("chart", editor.value);
});

/* LIMPEZA */
function cleanText(text) {
  return text.replace(/[^\x00-\x7F\n]/g, "").trim();
}

/* RENDER */
function render() {
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
        if (chord.trim() !== "") {
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

/* PDF */
function generatePDF() {
  const element = renderPDFLayout();

  const opt = {
    margin: 0,
    filename: "cifra.pdf",
    html2canvas: {
      scale: 3,          // 🔥 melhora MUITO a qualidade
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

/*Render PDF Layout0*/
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

    } else {
      const el = document.createElement("div");
      el.className = "pdf-line";

      line.split(" ").forEach(chord => {
        if (chord.trim() !== "") {
          const span = document.createElement("span");
          span.className = "pdf-chord";
          span.textContent = chord;
          el.appendChild(span);
        }
      });

      container.appendChild(el);
    }

  });

  return container;
}

/* IMPORT */
function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (evt) => {
    editor.value = evt.target.result;
    render();
  };

  reader.readAsText(file);
}

/* INIT */
render();
