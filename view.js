document.addEventListener("DOMContentLoaded", () => {
  // const API_BASE = "http://localhost:8000";

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
  // BUTTON CONTROLS
  // =========================

  document.getElementById("zoomIn").onclick = () => {
    scale += 0.2;
    scale = Math.min(scale, 3);
    applyTransform();
  };

  document.getElementById("zoomOut").onclick = () => {
    scale -= 0.2;
    scale = Math.max(scale, 0.5);
    applyTransform();
  };

  document.getElementById("rotate").onclick = () => {
    rotation += 90;
    applyTransform();
  };

  document.getElementById("reset").onclick = () => {
    scale = 1;
    rotation = 0;
    applyTransform();
  };

  // =========================
  // WHEEL ZOOM (FIXED)
  // =========================

  viewer.addEventListener("wheel", (e) => {
    e.preventDefault();

    const zoomSpeed = 0.1;

    if (e.deltaY < 0) {
      scale += zoomSpeed;
    } else {
      scale -= zoomSpeed;
    }

    scale = Math.min(Math.max(0.5, scale), 3);

    applyTransform(); // 🔥 используем ТУ ЖЕ функцию
  });
});
