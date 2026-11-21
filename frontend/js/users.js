import { userApi } from "./api";
import showToast from "./util/toast";
import validateUserFields from "./util/validation";

// Verifica se parâmetro 'ID' foi informado na URL da página
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");
const passwordInput = document.querySelector("#password");

// Caso o ID tenha sido informado, a página terá alguns campos reformulado própria para edição de cadastro, como o componente de modal de alteração de senha
if (userId) {
  document.querySelector("#active").classList.remove("readonly");

  const btnEditPassword = document.createElement("button");
  btnEditPassword.className =
    "btn btn-outline-secondary border border-start-0 rounded-end-5";

  btnEditPassword.title = "Editar senha";
  btnEditPassword.id = "btn-edit-password";
  btnEditPassword.type = "button";
  btnEditPassword.innerHTML = "<i class='bi bi-pencil-square'></i>";

  document
    .querySelector("#password")
    .parentElement.appendChild(btnEditPassword);

  document.querySelector("#page-title").innerHTML =
    "<i class='fg-emphasis-primary bi bi-file-earmark-person'></i> Editar usuário";
  passwordInput.required = false;
  passwordInput.disabled = true;

  passwordInput.value = "Dostoiévski";
  loadUser();
  modalPasswordListeners();
} else {
  // garantimos que náo será exibido o modal de alteração de seja pois se trata de um novo cadastro de usuário
  const modalPassword = document.querySelector("#modal-edit-password");
  modalPassword.remove();
}

// função para obter do backend os dados do usuário cadastrado com base no ID
async function loadUser() {
  const user = await userApi.findById(userId);

  if (!user) return;

  document.querySelector("#name").value = user.name;
  document.querySelector("#email").value = user.email;
  document.querySelector("#login").value = user.login;
  document.querySelector("#active").value = user.active ? "1" : "0";
}

// Edição de dados do usuário
let reloadTimeout;
const form = document.querySelector("#user-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearTimeout(reloadTimeout);
  

  const user = {
    active: document.querySelector("#active").value.trim() === "1" ? 1 : 0,
    name: document.querySelector("#name").value.trim(),
    email: document.querySelector("#email").value.trim(),
    login: document.querySelector("#login").value.trim(),
    password: document.querySelector("#password").value.trim(),
  };

  if (!validateUserFields(user)) {
    return null;
  }

  let userIdRedirect = null;
  if (userId) {
    const res = await userApi.update(userId, user);
    if (!res) return;
    userIdRedirect = userId;
  } else {
    const newUser = await userApi.create(user);

    if (!newUser) return;

    userIdRedirect = newUser.id;
  }

  showToast("Usuário salvo com sucesso!");
  reloadTimeout = setTimeout(() => {
    window.location.href = `/users.html?id=${encodeURIComponent(userIdRedirect)}`;
  }, 500);
});

// Edição de senha de usuário
function modalPasswordListeners() {
  const btnEditPassword = document.querySelector("#btn-edit-password");
  const btnSavePassword = document.querySelector("#btn-save-password");
  const btnCancelPassword = document.querySelector("#btn-cancel-password");
  const modalPassword = document.querySelector("#modal-edit-password");
  const newPassword = document.querySelector("#new-password");
  const containerMsgPassword = document.querySelector(
    "#container-msg-password",
  );
  const msgPassword = document.querySelector("#msg-password");

  btnEditPassword.addEventListener("click", (event) => {
    event.preventDefault();
    modalPassword.classList.remove("hidden");
  });

  btnCancelPassword.addEventListener("click", () => {
    modalPassword.classList.add("hidden");
  });

  let saveTimeout;
  btnSavePassword.addEventListener("click", async (event) => {
    clearTimeout(saveTimeout);
    event.preventDefault();
    if (newPassword.value.trim().length < 8) {
      msgPassword.textContent = "A senha deve possuir no mínimo 8 caracteres.";
      containerMsgPassword.classList.remove("invisible");
      saveTimeout = setTimeout(() => {
        msgPassword.textContent = "";
        containerMsgPassword.classList.add("invisible");
      }, 4000);

      return;
    }
    const res = await userApi.updatePassword(userId, newPassword.value.trim());

    if (!res) return;

    showToast("Senha alterada com sucesso!");

    window.location.reload();

    modalPassword.classList.add("hidden");
  });
}
