document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8000";

  const select = document.getElementById("modelSelect");
  const resultBox = document.getElementById("result");
  const previewBox = document.getElementById("preview");
  const loader = document.getElementById("loader");

  // =========================
  // FORMAT NAME WITH DATE
  // =========================
  function formatModelName(name) {
    const parts = name.split("_");

    if (parts.length < 2) return name;

    const base = parts[0];
    const timestamp = parts[1];

    const date = new Date(Number(timestamp));

    if (isNaN(date)) return base;

    const formatted = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

    return `${base} (${formatted})`;
  }

  // =========================
  // LOAD MODELS
  // =========================
  async function loadModels() {
    try {
      const res = await fetch(`${API_BASE}/api/models`);
      const models = await res.json();

      select.innerHTML = '<option value="">Select a scan</option>';

      models.forEach((model) => {
        const option = document.createElement("option");
        option.value = model; // важно: оригинал
        option.textContent = formatModelName(model); // красиво
        select.appendChild(option);
      });
    } catch (err) {
      console.error("Failed to load models:", err);
    }
  }

  loadModels();

  // =========================
  // AUTO PREVIEW ON SELECT
  // =========================
  select.addEventListener("change", async () => {
    const model = select.value;
    if (!model) return;

    try {
      const formData = new FormData();
      formData.append("model_name", model);

      const res = await fetch(`${API_BASE}/api/preview`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      previewBox.innerHTML = "";

      const img = document.createElement("img");
      img.src = `${API_BASE}${data.texture_url}`;

      previewBox.appendChild(img);

      localStorage.setItem("lastModelName", model);
    } catch (err) {
      console.error(err);
    }
  });

  // =========================
  // AUTO SELECT LAST MODEL
  // =========================
  const lastModel = localStorage.getItem("lastModelName");

  if (lastModel) {
    setTimeout(() => {
      select.value = lastModel;
      select.dispatchEvent(new Event("change"));
    }, 300);
  }

  // =========================
  // SEGMENT
  // =========================
  document.getElementById("segmentBtn").addEventListener("click", async () => {
    const model = select.value;

    if (!model) {
      alert("Please select a model");
      return;
    }

    try {
      loader.classList.remove("hidden");

      const formData = new FormData();
      formData.append("model_name", model);
      formData.append("method", "kmeans Jay");

      const res = await fetch(`${API_BASE}/api/segment`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Segmentation failed");

      const data = await res.json();

      resultBox.innerHTML = "";

      const img = document.createElement("img");
      img.src = `${API_BASE}${data.texture_url}?t=${Date.now()}`;

      resultBox.appendChild(img);
    } catch (err) {
      alert(err.message);
    } finally {
      loader.classList.add("hidden");
    }
  });
});
