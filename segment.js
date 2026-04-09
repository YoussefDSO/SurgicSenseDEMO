document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8000";

  // =========================
  // LOAD DEMO MODELS
  // =========================
  const select = document.getElementById("modelSelect");

  fetch(`${API_BASE}/api/models`)
    .then((res) => res.json())
    .then((models) => {
      models.forEach((model) => {
        const option = document.createElement("option");

        option.value = model.split(" ").pop();
        option.textContent = model;

        select.appendChild(option);
      });
    })
    .catch((err) => console.error("Failed to load models:", err));

  // =========================
  // MODE SWITCH (🔥 НОВОЕ)
  // =========================
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  const demoSection = document.getElementById("demoSection");
  const uploadSection = document.getElementById("uploadSection");

  modeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "demo" && radio.checked) {
        demoSection.classList.remove("hidden");
        uploadSection.classList.add("hidden");
      }

      if (radio.value === "upload" && radio.checked) {
        demoSection.classList.add("hidden");
        uploadSection.classList.remove("hidden");
      }
    });
  });

  // =========================
  // PREVIEW (UPLOAD MODE)
  // =========================
  document.getElementById("previewBtn")?.addEventListener("click", async () => {
    const obj = document.getElementById("objInput")?.files[0];
    const texture = document.getElementById("textureInput")?.files[0];
    const mtl = document.getElementById("mtlInput")?.files[0];

    if (!obj || !texture || !mtl) {
      alert("Please upload all required files");
      return;
    }

    const formData = new FormData();
    formData.append("obj_file", obj);
    formData.append("texture_file", texture);
    formData.append("mtl_file", mtl);

    try {
      const res = await fetch(`${API_BASE}/api/preview`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Preview failed");
      }

      const data = await res.json();

      const previewBox = document.getElementById("preview");
      previewBox.innerHTML = "";

      const img = document.createElement("img");
      img.src = `${API_BASE}${data.texture_url}`;
      img.style.maxWidth = "100%";

      previewBox.appendChild(img);
    } catch (err) {
      console.error(err);
      alert("Preview failed");
    }
  });

  // =========================
  // SEGMENT
  // =========================
  document.getElementById("segmentBtn")?.addEventListener("click", async () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;

    let model = document.getElementById("modelSelect").value;

    const obj = document.getElementById("objInput")?.files[0];
    const texture = document.getElementById("textureInput")?.files[0];
    const mtl = document.getElementById("mtlInput")?.files[0];

    const formData = new FormData();

    // 👉 DEMO MODE
    if (mode === "demo") {
      if (!model) {
        alert("Please select a model");
        return;
      }

      formData.append("model_name", model);
      formData.append("method", "kmeans Jay");
    }

    // 👉 UPLOAD MODE
    if (mode === "upload") {
      if (!obj || !texture || !mtl) {
        alert("Please upload all files");
        return;
      }

      formData.append("obj_file", obj);
      formData.append("texture_file", texture);
      formData.append("mtl_file", mtl);
      formData.append("method", "kmeans Jay");
    }

    try {
      const res = await fetch(`${API_BASE}/api/segment`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("SERVER ERROR:", text);
        throw new Error("Segmentation failed: " + res.status);
      }

      const data = await res.json();

      const resultBox = document.getElementById("result");
      resultBox.innerHTML = "";

      const img = document.createElement("img");
      img.src = `${API_BASE}${data.texture_url}`;
      img.style.maxWidth = "100%";

      resultBox.appendChild(img);
    } catch (err) {
      console.error(err);
      alert("Segmentation failed");
    }
  });
});

document.querySelectorAll(".upload-btn input").forEach((input) => {
  input.addEventListener("change", () => {
    const span = input.parentElement.querySelector("span");

    if (input.files.length > 0) {
      span.textContent = input.files[0].name;
    }
  });
});

document.getElementById("objInput")?.addEventListener("change", (e) => {
  document.getElementById("objLabel").textContent =
    e.target.files[0]?.name || "Upload OBJ file";
});

document.getElementById("textureInput")?.addEventListener("change", (e) => {
  document.getElementById("textureLabel").textContent =
    e.target.files[0]?.name || "Upload texture";
});

document.getElementById("mtlInput")?.addEventListener("change", (e) => {
  document.getElementById("mtlLabel").textContent =
    e.target.files[0]?.name || "Upload MTL file";
});

const modeRadios = document.querySelectorAll('input[name="mode"]');
const demoSection = document.getElementById("demoSection");
const uploadSection = document.getElementById("uploadSection");

modeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.value === "demo" && radio.checked) {
      demoSection.classList.remove("hidden");
      uploadSection.classList.add("hidden");
    }

    if (radio.value === "upload" && radio.checked) {
      demoSection.classList.add("hidden");
      uploadSection.classList.remove("hidden");
    }
  });
});
