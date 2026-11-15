const db = require("../database/database");

// Busca e retornar todos os usuário cadastrados
function findAll() {
  const users = db
    .prepare(
      `SELECT id, name, email, login, active FROM users ORDER BY name ASC`,
    )
    .all();
  return users.map((user) => ({
    ...user,
    active: Boolean(user.active),
  }));
}

// Buscar usuário pelo ID
function findById(id) {
  const user = db
    .prepare(`SELECT id, name, email, login, active FROM users WHERE id = ?`)
    .get(id);

  if (!user) return undefined;

  return { ...user, active: user.active === 1 };
}

// Buscar usuário pelo e-mail
function findByEmail(email) {
  const user = db
    .prepare(`SELECT id, name, email, login, active FROM users WHERE email = ?`)
    .get(email);

  if (!user) return undefined;

  return { ...user, active: user.active === 1 };
}

// Buscar usuário pelo login
function findByLogin(login) {
  const user = db
    .prepare(`SELECT id, name, email, login, active FROM users WHERE login = ?`)
    .get(login);

  if (!user) return undefined;

  return { ...user, active: user.active === 1 };
}

// Cadastrar usuário
function create(user) {
  const { id, name, email, login, password_hash } = user;
  const result = db
    .prepare(
      `INSERT INTO users(id, name, email, login, password_hash) VALUES(?, ?, ?, ?, ?)`
    )
    .run(id, name, email, login, password_hash);

  if (result.changes !== 1) {
    throw new Error("Não foi possível cadastrar o usuário");
  }

  const createdUser = db.prepare(`SELECT id, name, email, login FROM users WHERE id = ?`).get(id);

  return {...createdUser, active: user.active === 1 };
}

// Atualizar usuário
function updateUser(id, user) {
  const { name, email, login } = user;
  const result = db
    .prepare(`UPDATE users SET name = ?, email = ?, login = ? WHERE id = ?`)
    .run(name, email, login, id);

  if (result.changes !== 1) {
    throw new Error("Não foi possível atualizar o usuário");
  }

  const updatedUser = db.prepare(`SELECT id, name, email, login FROM users WHERE id = ?`).get(id);

  return {...updatedUser, active: user.active === 1 };

}

// Atualizar senha do usuário
function updatePassword(id, password_hash) {
  const result = db
    .prepare(`UPDATE users SET password_hash = ? WHERE id = ?`)
    .run(password_hash, id);

  if (result.changes !== 1) {
    throw new Error("Não foi possível atualizar a senha");
  }

  return true;
}

// Excluir usuário
function remove(id) {
  const result = db.prepare(`DELETE FROM users WHERE id = ?`).run(id);

  if (result.changes !== 1) {
    throw new Error("Não foi possível remover o usuário");
  }

  return true;
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  findByLogin,
  create,
  updateUser,
  updatePassword,
  remove,
};
