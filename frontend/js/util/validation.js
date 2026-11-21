export default function validateUserFields(user) {
  const errors = [];

  if (user.active !== 0 && user.active !== 1) {
    errors.push({
      field: "active",
      message: "O Status deve ser ativo ou inativo.",
    });
  }

  if (!user.name || String(user.name).trim().length < 3) {
    errors.push({
      field: "name",
      message: "O nome deve possuir pelo menos 3 caracteres.",
    });
  }

  if (!user.login || String(user.login).trim().length < 3) {
    errors.push({
      field: "login",
      message: "O login deve possuir pelo menos 3 caracteres.",
    });
  }

  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.push({
      field: "email",
      message: "Informe um e-mail válido.",
    });
  }

  if (!user.password || String(user.password).trim().length < 8) {
    errors.push({
      field: "password",
      message: "A senha deve possuir pelo menos 8 caracteres.",
    });
  }

  if (errors.length > 0) {
    showFieldErrors(errors);
    return false;
  } else {
    return true;
  }
}

const fieldTranslate = {
  active: "Status",
  name: "Nome",
  email: "E-mail",
  login: "Login",
  password: "Senha",
};

let errorTimeout;

function showFieldErrors(errors) {
  const msgErro = document.querySelector("#msg-erro");
  const listErros = document.createElement("ul");

  clearTimeout(errorTimeout);

  document.querySelectorAll(".input-error").forEach((field) => {
    field.classList.remove("input-error");
  });

  msgErro.replaceChildren();
  msgErro.innerHTML = "<p>Erro nos seguintes campos: </p>";

  errors.forEach((erro) => {
    const itemList = document.createElement("li");
    const field = document.querySelector(`#${erro.field}`);

    if (field) {
      field.classList.add("input-error");
    }

    itemList.textContent = `${fieldTranslate[erro.field] || erro.field} - ${erro.message}.`;

    listErros.appendChild(itemList);
  });

  msgErro.appendChild(listErros);
  msgErro.classList.remove("hidden");

  errorTimeout = setTimeout(() => {
    msgErro.classList.add("hidden");

    document.querySelectorAll(".input-error").forEach((field) => {
      field.classList.remove("input-error");
    });

    msgErro.replaceChildren();
  }, 15000);
}
