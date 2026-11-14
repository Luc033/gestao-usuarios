const userService = require("../services/userService");

async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    return res.status(200).json(user);
  } catch (error) {
    if(error.message === "Usuário não encontrado."){
        return res.status(404).json({
            message: error.message
        });
    }
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;

    const user = await userService.updateUser(id, req.body);

    return res.status(200).json(user);
  } catch (error) {
    if(error.message === "Usuário não encontrado."){
        return res.status(404).json({
            message: error.message
        });
    }
    next(error);
  }
}

async function updatePassword(req, res, next) {
  try {
    const { id } = req.params;

    await userService.updatePassword(id, req.body.password);

    return res.status(204).send();
  } catch (error) {
    if(error.message === "Usuário não encontrado."){
        return res.status(404).json({
            message: error.message
        });
    }
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    await userService.deleteUser(id, req.body);

    return res.status(204).send();
  } catch (error) {
    if(error.message === "Usuário não encontrado."){
        return res.status(404).json({
            message: error.message
        });
    }
    next(error);
  }
}










module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser
};
