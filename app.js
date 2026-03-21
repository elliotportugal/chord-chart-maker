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
  const opt = {
    margin: 10,
    filename: "cifra.pdf",
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4" }
  };

  html2pdf().set(opt).from(preview).save();
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
