
import { userApi } from "./api";
import showToast from "./util/toast";

let users = [];

// Obtém do backend a listagem de todos os usuários
async function loadUsers() {
  const result = await userApi.findAll();

  if (!Array.isArray(result)) return;

  users = result;
  renderUsers(users);
}

// executação a função loadUsers sempre que a página terminar de ser carregada
document.addEventListener("DOMContentLoaded", loadUsers);

// ao clicar no botão 'incluir usuário', o cliente é redirecionado para o formulário de cadastro de usuário
const btnNewUser = document.querySelector("#btn-new-user");

btnNewUser.addEventListener("click", () => {
  window.location.href = "/users.html";
});

// Renderiza listando em tabela cada usuário cadastrado e seus respectivos dados
function renderUsers(usersToRender) {
  const table = document.querySelector("#users-list");
  table.replaceChildren();

  if (!Array.isArray(usersToRender)) return;

  if (usersToRender.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 5;
    cell.className = "text-center py-4";
    cell.textContent = "Nenhum usuário foi encontrado.";

    row.appendChild(cell);
    table.appendChild(row);
    return;
  }

  usersToRender.forEach((user) => {
    const row = document.createElement("tr");
    row.className = "text-center";

    const status = document.createElement("td");
    status.textContent = user.active ? "Ativo" : "Inativo";

    const name = document.createElement("td");
    name.className = "txt-truncate";
    name.textContent = user.name;

    const email = document.createElement("td");
    email.textContent = user.email;

    const login = document.createElement("td");
    login.textContent = user.login;

    const actions = document.createElement("td");
    actions.className = "d-flex align-items-center justify-content-evenly";

    const editBtn = document.createElement("a");
    const iconEdit = document.createElement("i");

    iconEdit.className = "bi bi-pencil-fill";
    editBtn.title = "Editar usuário";
    editBtn.append(iconEdit);
    editBtn.href = `users.html?id=${encodeURIComponent(user.id)}`;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-link fg-danger p-1";
    removeBtn.title = "Remover usuário";

    const iconRemove = document.createElement("i");
    iconRemove.className = "bi bi-trash-fill fg-danger";

    removeBtn.append(iconRemove);
    removeBtn.addEventListener("click", () => removerUsuario(user.id));

    actions.append(editBtn, removeBtn);

    row.append(status, name, email, login, actions);
    table.appendChild(row);
  });
}

// Remove o usuário cadastrado, após confirmação do cliente, exibindo mensagem de sucesso ou erro, e por fim, atualiza a página atual
let removeTimeout;

async function removerUsuario(userId) {
  clearTimeout(removeTimeout);

  const hasConfirmed = confirm(
    "Você deseja remover permanentemente este usuário?",
  );

  if (!hasConfirmed) return;

  const res = await userApi.remove(userId);

  if (!res) return;

  showToast("Usuário excluído com sucesso!");

  window.location.reload();
}

// Manipula a array de usuário para buscar pelo termo digitado, renderizando a tabela de usuário novamente listando os resultados encontrados
const inputSearch = document.querySelector("#search-user");
const btnSearch = document.querySelector("#btn-search");

btnSearch.addEventListener("click", () => {
  const search = inputSearch.value.toLowerCase().trim();

  if (search.length < 2) return;

  const usersFound = users.filter((user) =>
    [user.name, user.email, user.login].some((field) =>
      field.toLowerCase().includes(search),
    ),
  );

  renderUsers(usersFound);
});
