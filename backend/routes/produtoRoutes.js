const express = require('express');

const {
    listarProdutos,
    cadastrarProduto,
    editarProduto,
    excluirProduto
} = require('../controllers/produtoController');

const router = express.Router();

router.get('/', listarProdutos);

router.post('/', cadastrarProduto);

router.put('/:id', editarProduto);

router.delete('/:id', excluirProduto);

module.exports = router;