document.addEventListener("DOMContentLoaded", () => {
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
      const res = await fetch("http://localhost:8000/api/preview", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Preview failed");
      }

      const data = await res.json();
      console.log("Preview result:", data);

      const previewBox = document.querySelector(
        ".segment-results .segment-box:first-child .placeholder",
      );

      previewBox.innerHTML = "";

      const img = document.createElement("img");
      img.src = `http://localhost:8000${data.texture_url}`;

      previewBox.appendChild(img);
    } catch (err) {
      console.error(err);
      alert("Preview failed");
    }
  });

  document.getElementById("segmentBtn").addEventListener("click", async () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const formData = new FormData();

    if (mode === "upload") {
      const obj = document.getElementById("objInput").files[0];
      const texture = document.getElementById("textureInput").files[0];
      const mtl = document.getElementById("mtlInput").files[0];

      if (!obj || !texture || !mtl) {
        alert("Please upload all files");
        return;
      }

      formData.append("obj_file", obj);
      formData.append("texture_file", texture);
      formData.append("mtl_file", mtl);
    }

    if (mode === "demo") {
      const model = document.getElementById("modelSelect").value;

      if (!model) {
        alert("Please select a model");
        return;
      }

      formData.append("model_name", model);
    }

    formData.append("method", "kmeans");

    try {
      const res = await fetch("http://localhost:8000/api/segment", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const resultBox = document.getElementById("resultBox");
      resultBox.innerHTML = "";

      const img = document.createElement("img");
      img.src = `http://localhost:8000${data.texture_url}`;

      resultBox.appendChild(img);
    } catch (err) {
      console.error(err);
      alert("Segmentation failed");
    }
  });

  document.querySelectorAll(".upload-btn input").forEach((input) => {
    input.addEventListener("change", () => {
      const span = input.parentElement.querySelector("span");
      if (input.files.length > 0) {
        span.textContent = input.files[0].name;
      }
    });
  });

  const demoModels = [
    "p1_1Leo_v1",
    "p2_2Leo_v1",
    "p3_3Leo_v1",
    "hand_Bogdan",
    "HP_00",
  ];

  const select = document.getElementById("modelSelect");

  demoModels.forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    select.appendChild(option);
  });

  const modeRadios = document.querySelectorAll('input[name="mode"]');
  const demoContainer = document.getElementById("demoSelectContainer");
  const uploadSection = document.getElementById("uploadSection");

  modeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "demo" && radio.checked) {
        demoContainer.style.display = "block";
        uploadSection.style.display = "none";
      }

      if (radio.value === "upload" && radio.checked) {
        demoContainer.style.display = "none";
        uploadSection.style.display = "block";
      }
    });
  });
});
