const express = require('express');

const router = express.Router();

const baiaController =
    require('../controllers/baiaController');

router.get(
    '/',
    baiaController.listar
);

module.exports = router;