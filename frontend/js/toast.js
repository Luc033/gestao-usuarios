function showToast(message, type = "success") {
  const types = {
    success: {
      icon: "bi-check-circle-fill",
      title: "Operação realizada com sucesso!",
      class: "bg-success",
    },
    error: {
      icon: "bi-exclamation-triangle-fill",
      title: "Operação não realizada!",
      class: "bg-danger",
    },
  };

  const toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  toastContainer.className =
    "w-25 mt-5 p-4 d-flex flex-column z-toast position-absolute top-0 end-0 rounded-4";

  const toastHeader = document.createElement("div");
  toastHeader.className =
    "mb-3 px-4 d-flex justify-content-start gap-5 fs-lg fw-medium";

  const toastIcon = document.createElement("i");

  const toastTitle = document.createElement("div");

  const toastMessage = document.createElement("div");
  toastMessage.className = "fs-md px-4";

  switch (type) {
    case "success":
      toastContainer.classList.add(types.success.class);
      toastIcon.classList.add(...types.success.icon.split(" "));
      toastTitle.textContent = types.success.title;
      break;

    case "error":
      toastContainer.classList.add(types.error.class);
      toastIcon.classList.add(...types.error.icon.split(" "));
      toastTitle.textContent = types.error.title;
      break;

    default:
        console.error("Erro ao exibir o toast.")
      break;
  }

  toastMessage.textContent = message;
  toastHeader.appendChild(toastIcon);
  toastHeader.appendChild(toastTitle);

  toastContainer.appendChild(toastHeader);
  toastContainer.appendChild(toastMessage);

  const body = document.querySelector("body");
  body.appendChild(toastContainer);
  
  setTimeout( () => {
    toastContainer.remove();
  }, 3000);
}


export default showToast;