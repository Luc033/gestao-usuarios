const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");

// Função para validar campos obrigatórios para cadastrado do usuário
function validateUser(user, userId = null) {
  // nome obrigado e no minimo 3 caracteres
  // email é obrigatorio, formato valido e único
  // login é obrigatorio, no minimo 3 caracteres e único
  // senha deve ter no minimo 8 caracteres

  if (!user.name || user.name.trim().length < 3) {
    throw new Error("O nome deve possuir pelo menos 3 caracteres.");
  }

  if (!user.login || user.login.trim().length < 3) {
    throw new Error("O login deve possui pelo menos 3 caracteres.");
  }

  // Verifica se login já existe
  const loginExist = userRepository.findByLogin(user.login);

  if (loginExist && loginExist.id !== userId) {
    throw new Error("O login informado já foi utilizado.");
  }

  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    throw new Error("Informe um e-mail válido.");
  }

  // Verifica se o email já existe
  const emailExist = userRepository.findByLogin(user.email);

  if (emailExist && emailExist.id !== userId) {
    throw new Error("O email informado já foi utilizado.");
  }
}

function validatePassword(password) {
  if (!password || password.trim().length < 8) {
    throw new Error("A senha deve possuir pelo menos 8 caracteres.");
  }
}

// Função para criar usuário novo
async function createUser(user) {
  // valida os dados de entrada do usuário
  validateUser(user);

  validatePassword(user.password);

  // Gera o hash da senha
  const passwordHash = await bcrypt.hash(user.password, 12);

  // Cria um novo objeto com os dados tratados para ser persistidos no banco
  const newUser = {
    id: crypto.randomUUID(),
    name: user.name.trim().toLowerCase(),
    email: user.email.trim().toLowerCase(),
    login: user.login.trim().toLowerCase(),
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
    throw new Error("Usuário não encontrado.");
  }

  return user;
}

// Atualiza um usuário por id
function updateUser(id, user) {
  // verifica se usuário existe no banco
  if (!userRepository.findById(id)) {
    throw new Error("Usuário não encontrado.");
  }
  
  // valida todos os dados enviados pela requisição
  validateUser(user, id);
  
  // Dados da requisição foram tratados, será feito a persistencia e atualização do cadastro no banco
  const updateUser = {
    name: user.name.trim().toLowerCase(),
    email: user.email.trim().toLowerCase(),
    login: user.login.trim().toLowerCase(),
  };

  return userRepository.updateUser(id, updateUser);
}

// Atualiza a senha do usuário por id
async function updatePassword(id, password) {
  // verifica se usuário existe no banco
  if (!userRepository.findById(id)) {
    throw new Error("Usuário não encontrado.");
  }

  // Valida se senha está de acordo com as regras de negócio
  validatePassword(password);
  
  // Gera o hash da senha
  const passwordHash = await bcrypt.hash(password, 12);

  // altera somente a senha (em hash) do usuário
  return userRepository.updatePassword(id, passwordHash);
}


// Remove permanemente um usuario cadastrado por id
function deleteUser(id) {
  // verifica se usuário existe no banco
  if (!userRepository.findById(id)) {
    throw new Error("Usuário não encontrado.");
  }

  const isDeleted = userRepository.remove(id);

  if (!isDeleted) {
    throw new Error("Houve um erro ao remover o usuário.");
  }

  return true;
}


module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser
};
