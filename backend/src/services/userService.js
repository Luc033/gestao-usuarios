const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");

function validateUser(user) {
  // nome obrigado e no minimo 3 caracteres
  // email é obrigatorio, formato valido e único
  // login é obrigatorio, no minimo 3 caracteres e único
  // senha deve ter no minimo 8 caracteres

  if (!user.name || user.name.trim().length < 3) {
    throw new Error("O nome deve possuir pelo menos 3 caracteres.");
  }

  if (!user.password || user.password.trim().length < 8) {
    throw new Error("A senha deve possuir pelo menos 8 caracteres.");
  }

  if (!user.login && user.login.trim().length < 3) {
    throw new Error("O login deve possui pelo menos 3 caracteres.");
  }

  if (userRepository.findByLogin(user.login)) {
    throw new Error("O login informado já foi utilizado.");
  }

  // verificar depois
  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    throw new Error("Informe um e-mail válido.");
  }

  if (userRepository.findByEmail(user.email)) {
    throw new Error("O email informado já foi utilizado.");
  }
}
