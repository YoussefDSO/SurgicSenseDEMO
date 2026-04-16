document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8000";

  const viewer = document.getElementById("viewer");

  let scale = 1;
  let rotation = 0;
  let img = null;

  const model = localStorage.getItem("lastModelName");

  if (!model) {
    viewer.innerHTML = "<p>No scan loaded</p>";
    return;
  }

  loadImage(model);

  async function loadImage(model) {
    try {
      const formData = new FormData();
      formData.append("model_name", model);

      const res = await fetch(`${API_BASE}/api/preview`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      viewer.innerHTML = "";

      img = document.createElement("img");
      img.src = `${API_BASE}${data.texture_url}`;

      viewer.appendChild(img);

      applyTransform();
    } catch {
      viewer.innerHTML = "<p>Failed to load image</p>";
    }
  }

  function applyTransform() {
    if (!img) return;

    img.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
  }

  // =========================
  // CONTROLS
  // =========================

  document.getElementById("zoomIn").onclick = () => {
    scale += 0.2;
    applyTransform();
  };

  document.getElementById("zoomOut").onclick = () => {
    scale = Math.max(0.2, scale - 0.2);
    applyTransform();
  };

  document.getElementById("rotateLeft").onclick = () => {
    rotation -= 15;
    applyTransform();
  };

  document.getElementById("rotateRight").onclick = () => {
    rotation += 15;
    applyTransform();
  };

  document.getElementById("reset").onclick = () => {
    scale = 1;
    rotation = 0;
    applyTransform();
  };
});
