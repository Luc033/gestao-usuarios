const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const AppError = require("../errors/AppError");
const crypto = require("node:crypto");

// Função para validar preenchimento e formatação nos campos obrigatórios
function validateUserFields(user) {
  // nome obrigado e no minimo 3 caracteres
  // email é obrigatorio, formato valido e único
  // login é obrigatorio, no minimo 3 caracteres e único
  // senha deve ter no minimo 8 caracteres
  const errors = [];

  if (user.active !== 0 && user.active !== 1) {
    errors.push({
      field: "active",
      message: "Active deve ser um valor entre 0 e 1.",
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

  return errors;
}

// Função para validar possíveis conflitos no login/email do usuario cadastrado
function checkUserConflict(user, userId = null) {
  const errors = [];

  const loginExist = userRepository.findByLogin(
    String(user.login).trim().toLowerCase()
  );

  if (loginExist && loginExist.id !== String(userId)) {
    errors.push({
      field: "login",
      message: "O login informado já foi utilizado.",
    });
  }

  const emailExist = userRepository.findByEmail(
    String(user.email).trim().toLowerCase()
  );

  if (emailExist && emailExist.id !== String(userId)) {
    errors.push({
      field: "email",
      message: "O email informado já foi utilizado.",
    });
  }

  return errors;
}

function validatePassword(password) {
  const errors = [];

  if (!password || String(password).trim().length < 8) {
    errors.push({
      field: "senha",
      message: "A senha deve possuir pelo menos 8 caracteres.",
    });
  }

  return errors;
}

// Função para criar usuário novo
async function createUser(user) {
  // valida os dados de entrada do usuário estão formatados e preenchidos corretamente
  const validationErrors = [
    ...validateUserFields(user),
    ...validatePassword(user.password),
  ];

  if (validationErrors.length > 0) {
    throw new AppError("Existem campos inválidos.", 400, validationErrors);
  }

  // verifica se houve conflito no email/login informado
  const checkConflicts = checkUserConflict(user);

  if (checkConflicts.length > 0) {
    throw new AppError(
      "Existem conflitos nos dados informados.",
      409,
      checkConflicts,
    );
  }

  // Gera o hash da senha
  const passwordHash = await bcrypt.hash(String(user.password), 12);

  // Cria um novo objeto com os dados tratados para ser persistidos no banco
  const newUser = {
    id: crypto.randomUUID(),
    active: Number(user.active),
    name: String(user.name).trim().toLowerCase(),
    email: String(user.email).trim().toLowerCase(),
    login: String(user.login).trim().toLowerCase(),
    password_hash: passwordHash,
  };

  return userRepository.create(newUser);
}

// Obtém todos os usuários cadastrados
function listUsers() {
  return userRepository.findAll();
}

// Obtém um usuário por id e retorna erro caso usuário não for encontrado
function getUserById(id) {
  // verifica se usuário existe no banco
  const user = userRepository.findById(id);

  if (!user) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  return user;
}

// Atualiza um usuário por id
function updateUser(id, user) {
  // verifica se usuário existe no banco
  if (!userRepository.findById(id)) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  // valida todos os dados enviados pela requisição, exceto a senha
  const validationErrors = validateUserFields(user);

  // retorna os erros nos campos encontrados
  if (validationErrors.length > 0) {
    throw new AppError("Existem campos inválidos.", 400, validationErrors);
  }

  // verifica se houve conflito no email/login informado
  const checkConflicts = checkUserConflict(user, id);

  if (checkConflicts.length > 0) {
    throw new AppError(
      "Existem conflitos nos dados informados.",
      409,
      checkConflicts,
    );
  }

  // Dados da requisição foram tratados, será feito a persistencia e atualização do cadastro no banco
  const updateUser = {
    active: Number(user.active),
    name: String(user.name).trim().toLowerCase(),
    name: String(user.name).trim().toLowerCase(),
    email: String(user.email).trim().toLowerCase(),
    login: String(user.login).trim().toLowerCase(),
  };

  return userRepository.updateUser(id, updateUser);
}

// Atualiza a senha do usuário por id
async function updatePassword(id, password) {
  // verifica se usuário existe no banco
  if (!userRepository.findById(id)) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  // Valida se senha está de acordo com as regras de negócio
  const validationErrors = validatePassword(password);

  if (validationErrors.length > 0) {
    throw new AppError(
      "A senha deve possuir pelo menos 8 caracteres.",
      400,
      validationErrors,
    );
  }

  // Gera o hash da senha
  const passwordHash = await bcrypt.hash(String(password), 12);

  // altera somente a senha (em hash) do usuário
  return userRepository.updatePassword(id, passwordHash);
}

// Remove permanemente um usuario cadastrado por id
function deleteUser(id) {
  // verifica se usuário existe no banco
  if (!userRepository.findById(id)) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  userRepository.remove(id);

  return true;
}

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser,
};
