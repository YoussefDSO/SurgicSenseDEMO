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

document.getElementById("segmentBtn")?.addEventListener("click", async () => {
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
  formData.append("method", "kmeans Jay");

  try {
    const res = await fetch("http://localhost:8000/api/segment", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    const data = await res.json();
    console.log("Segmentation result:", data);

    const resultBox = document.querySelector(
      ".segment-results .segment-box:last-child .placeholder",
    );

    resultBox.innerHTML = "";

    const img = document.createElement("img");
    img.src = `http://localhost:8000${data.texture_url}?t=${Date.now()}`;

    resultBox.appendChild(img);

    alert("Segmentation finished!");
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
