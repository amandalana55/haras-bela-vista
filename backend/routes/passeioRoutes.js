const express = require('express');

const {
    listarPasseios,
    cadastrarPasseio,
    editarPasseio,
    excluirPasseio
} = require('../controllers/passeioController');

const router = express.Router();

router.get('/', listarPasseios);

router.post('/', cadastrarPasseio);

router.put('/:id', editarPasseio);

router.delete('/:id', excluirPasseio);

module.exports = router;