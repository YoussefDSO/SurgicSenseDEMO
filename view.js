document.addEventListener("DOMContentLoaded", () => {
  const viewer = document.getElementById("viewer");

  let scale = 1;
  let rotation = 0;
  let img = null;

  // 👉 drag состояние
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;

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

      updateTransform();
    } catch {
      viewer.innerHTML = "<p>Failed to load image</p>";
    }
  }

  // =========================
  // TRANSFORM
  // =========================
  function updateTransform() {
    if (!img) return;

    img.style.transform = `
      translate(${translateX}px, ${translateY}px)
      scale(${scale})
      rotate(${rotation}deg)
    `;
  }

  // =========================
  // BUTTON CONTROLS
  // =========================

  document.getElementById("zoomIn").onclick = () => {
    scale += 0.2;
    scale = Math.min(scale, 3);
    updateTransform();
  };

  document.getElementById("zoomOut").onclick = () => {
    scale -= 0.2;
    scale = Math.max(scale, 0.5);
    updateTransform();
  };

  document.getElementById("rotate").onclick = () => {
    rotation += 90;
    updateTransform();
  };

  document.getElementById("reset").onclick = () => {
    scale = 1;
    rotation = 0;
    translateX = 0;
    translateY = 0;
    updateTransform();
  };

  // =========================
  // WHEEL ZOOM
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

    updateTransform();
  });

  // =========================
  // DRAG
  // =========================

  viewer.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    viewer.style.cursor = "grabbing";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    viewer.style.cursor = "grab";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    translateX = e.clientX - startX;
    translateY = e.clientY - startY;

    updateTransform();
  });
});
