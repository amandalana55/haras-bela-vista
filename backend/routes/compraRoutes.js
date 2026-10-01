const express = require('express');

const {
    listarCompras
} = require('../controllers/compraController');

const router = express.Router();

router.get('/', listarCompras);

module.exports = router;