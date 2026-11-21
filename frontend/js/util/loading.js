const body = document.querySelector("body");

export function showLoading() {
  if (document.querySelector("#loading")) return;
  const overlay = document.createElement("div");
  overlay.id = "loading";
  overlay.className =
    "position-fixed top-0 start-0 w-100 vh-100 bg-black bg-50 z-dialog align-items-center justify-content-center d-flex";

  const msg = document.createElement("div");
  msg.className = "fg-white fw-semibold text-center";
  msg.innerHTML = `
    <i class="bi bi-arrow-repeat spinning fs-4xl"></i> 
    <p>Carregando, aguarde...</p>`;

  overlay.append(msg);

  body.appendChild(overlay);
}

export function hideLoading() {
  const loading = body.querySelector("#loading");

  if (!loading) return;

  setTimeout(() => {
    loading.remove();
  }, 300);
}
