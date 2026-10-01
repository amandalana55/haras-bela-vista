const express = require('express');

const {
    gerarRelatorios
} = require('../controllers/relatorioController');

const router = express.Router();

router.get('/', gerarRelatorios);

module.exports = router;