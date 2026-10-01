const express = require('express');

const router = express.Router();

const proprietarioController =
    require('../controllers/proprietarioController');

const upload =
    require('../middleware/upload');


// LISTAR

router.get(
    '/',
    proprietarioController.listar
);


// BUSCAR UM

router.get(
    '/:id',
    proprietarioController.buscarPorId
);


// CADASTRAR

router.post(
    '/',
    upload.single('foto'),
    proprietarioController.criar
);


// EDITAR

router.put(
    '/:id',
    upload.single('foto'),
    proprietarioController.atualizar
);


// EXCLUIR

router.delete(
    '/:id',
    proprietarioController.excluir
);


module.exports = router;