document.addEventListener("DOMContentLoaded", () => {
  // const API_BASE = "http://localhost:8000";

  const select = document.getElementById("modelSelect");
  const preview = document.getElementById("preview");
  const placeholder = document.getElementById("placeholder");
  const loader = document.getElementById("loader");

  const uploadBtn = document.getElementById("uploadModelBtn");
  const messageBox = document.getElementById("uploadStatus");

  const objInput = document.getElementById("objInput");
  const textureInput = document.getElementById("textureInput");
  const mtlInput = document.getElementById("mtlInput");
  const zipInput = document.getElementById("zipInput");

  // =========================
  // LOAD MODELS
  // =========================
  fetch(`${API_BASE}/api/models`)
    .then((res) => res.json())
    .then((models) => {
      select.innerHTML = '<option value="">Select a scan</option>';

      models.forEach((model) => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        select.appendChild(option);
      });
    })
    .catch(() => {
      messageBox.textContent = "Failed to load models";
      messageBox.className = "upload-message error";
    });

  // =========================
  // DEMO PREVIEW (FIXED)
  // =========================
  select.addEventListener("change", async () => {
    const model = select.value;

    if (!model) {
      preview.style.display = "none";
      placeholder.style.display = "block";
      return;
    }

    try {
      loader?.classList.remove("hidden");

      const formData = new FormData();
      formData.append("model_name", model);

      const res = await fetch(`${API_BASE}/api/preview`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Preview failed");

      const data = await res.json();

      preview.src = `${API_BASE}${data.texture_url}`;
      preview.style.display = "block";
      placeholder.style.display = "none";

      localStorage.setItem("lastModelName", model);
      localStorage.setItem("uploadedScan", preview.src);
    } catch (err) {
      preview.style.display = "none";
      placeholder.style.display = "block";
      messageBox.textContent = "Preview failed";
      messageBox.className = "upload-message error";
    } finally {
      loader?.classList.add("hidden");
    }
  });

  // =========================
  // UPLOAD PREVIEW (LOCAL FILE)
  // =========================
  textureInput.addEventListener("change", () => {
    const file = textureInput.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    preview.src = url;
    preview.style.display = "block";
    placeholder.style.display = "none";

    localStorage.setItem("uploadedScan", url);
  });

  // =========================
  // FILE LABELS
  // =========================
  objInput.addEventListener("change", (e) => {
    document.getElementById("objLabel").textContent =
      e.target.files[0]?.name || "Upload OBJ file";
  });

  textureInput.addEventListener("change", (e) => {
    document.getElementById("textureLabel").textContent =
      e.target.files[0]?.name || "Upload texture";
  });

  mtlInput.addEventListener("change", (e) => {
    document.getElementById("mtlLabel").textContent =
      e.target.files[0]?.name || "Upload MTL file";
  });

  // =========================
  // ZIP UPLOAD
  // =========================
  zipInput.addEventListener("change", async () => {
    const file = zipInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("zip_file", file);

    try {
      loader?.classList.remove("hidden");

      const res = await fetch(`${API_BASE}/api/upload-zip`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("ZIP upload failed");

      messageBox.textContent = "ZIP uploaded successfully!";
      messageBox.className = "upload-message success";

      setTimeout(() => location.reload(), 800);
    } catch (err) {
      messageBox.textContent = err.message;
      messageBox.className = "upload-message error";
    } finally {
      loader?.classList.add("hidden");
    }
  });

  // =========================
  // UPLOAD BUTTON
  // =========================
  uploadBtn.onclick = async () => {
    messageBox.textContent = "";
    messageBox.className = "upload-message";

    const selectedModel = select.value;

    // 👉 DEMO → просто перейти дальше
    if (selectedModel) {
      localStorage.setItem("lastModelName", selectedModel);
      window.location.href = "segment.html";
      return;
    }

    const obj = objInput.files[0];
    const texture = textureInput.files[0];
    const mtl = mtlInput.files[0];

    if (!obj || !texture || !mtl) {
      messageBox.textContent = "Please upload all required files.";
      messageBox.classList.add("error");
      return;
    }

    const baseName = obj.name.split(".")[0].replace(/\s+/g, "_");

    const formData = new FormData();
    formData.append("obj_file", obj);
    formData.append("texture_file", texture);
    formData.append("mtl_file", mtl);
    formData.append("model_name", baseName);

    try {
      loader?.classList.remove("hidden");

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();

      if (res.status === 409) {
        messageBox.textContent = "This scan already exists.";
        messageBox.className = "upload-message warning";
        return;
      }

      if (!res.ok) {
        throw new Error(text || "Upload failed");
      }

      messageBox.textContent = "Upload successful!";
      messageBox.className = "upload-message success";

      localStorage.setItem("lastModelName", baseName);

      setTimeout(() => {
        window.location.href = "segment.html";
      }, 800);
    } catch (err) {
      messageBox.textContent = err.message;
      messageBox.className = "upload-message error";
    } finally {
      loader?.classList.add("hidden");
    }
  };
});
