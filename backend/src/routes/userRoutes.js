const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Cadastrar usuário
router.post('/', userController.createUser);

// Listar usuários
router.get('/', userController.listUsers);

// Buscar usuário específico
router.get('/:id', userController.getUserById);

// Atualizar usuário
router.put('/:id', userController.updateUser);

// Atualizar senha do usuário
router.patch('/:id/password', userController.updatePassword);

// Excluir usuário
router.delete('/:id', userController.deleteUser);

module.exports = router;