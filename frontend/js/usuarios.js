import { userApi } from './api';

let users = [];

async function loadUsers() {
    try {
        users = await userApi.findAll();

        console.log(users)
        renderUsers(users)
    } catch (error) {
        console.error("Não foi possível carregar os usuários");
    }    
}

document.addEventListener('DOMContentLoaded', loadUsers);

function renderUsers(usersToRender) {
    const table = document.querySelector("#users-list");
    table.replaceChildren();

    usersToRender.forEach(user => {
        const row = document.createElement('tr');
        row.className = "text-center";

        const status = document.createElement('td');
        status.textContent = user.active ? "Ativo" : "Inativo";
        
        const name = document.createElement('td');
        name.className = "txt-truncate"
        name.textContent = user.name;
        
        const email = document.createElement('td');
        email.textContent = user.email;
        
        const login = document.createElement('td');
        login.textContent = user.login;
        
        const actions = document.createElement('td');
        actions.className = "d-flex align-items-center justify-content-evenly";
        
        const editBtn = document.createElement('a');
        const iconEdit = document.createElement('i');
        iconEdit.className = "bi bi-pencil-fill";
        editBtn.append(iconEdit);
        editBtn.href = `formulario/id=${encodeURIComponent(user.id)}`;

        
        const removeBtn = document.createElement('button');
        removeBtn.className = "btn"
        // btn:active que ta exibindo a borda ao clicar
        const iconRemove = document.createElement('i');
        iconRemove.className = "bi bi-trash-fill text-danger";
        removeBtn.append(iconRemove);
        removeBtn.addEventListener('click', () => deleteUser(user.id));

        actions.append(editBtn, removeBtn);

        row.append(status, name, email, login, actions);
        table.appendChild(row);
    });
}