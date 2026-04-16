document.addEventListener("DOMContentLoaded", () => {
  const image = document.getElementById("printImage");
  const message = document.getElementById("noImage");

  const result = localStorage.getItem("lastResult");

  // =========================
  // SHOW RESULT
  // =========================
  if (result) {
    image.src = result;
    image.classList.add("show");
    message.style.display = "none";
  } else {
    message.textContent = "No scan available.";
  }

  // =========================
  // PRINT
  // =========================
  document.getElementById("printBtn").onclick = () => {
    if (!result) {
      alert("No scan available to print.");
      return;
    }

    window.print();
  };
});
