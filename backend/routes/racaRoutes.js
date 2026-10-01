const express = require('express');

const router = express.Router();

const racaController =
    require('../controllers/racaController');

router.get(
    '/',
    racaController.listar
);

module.exports = router;