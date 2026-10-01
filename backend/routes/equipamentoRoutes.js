const express = require('express');

const router = express.Router();

const equipamentoController =
    require('../controllers/equipamentoController');

const upload =
    require('../middleware/upload');


// LISTAR
router.get(
    '/',
    equipamentoController.listar
);


// BUSCAR UM
router.get(
    '/:id',
    equipamentoController.buscarPorId
);


// CADASTRAR
router.post(
    '/',
    upload.single('foto'),
    equipamentoController.cadastrar
);


// EDITAR
router.put(
    '/:id',
    upload.single('foto'),
    equipamentoController.editar
);


// EXCLUIR
router.delete(
    '/:id',
    equipamentoController.excluir
);


module.exports = router;