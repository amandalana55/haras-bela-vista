const express = require('express');
const multer = require('multer');
const path = require('path');

const gerenteController =
    require('../controllers/gerenteController');

const router = express.Router();


// =====================================================
// CONFIGURAÇÃO DA FOTO
// =====================================================

const pastaImagens = path.join(
    __dirname,
    '../../frontend/images'
);


const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, pastaImagens);

    },

    filename: (req, file, cb) => {

        const extensao = path
            .extname(file.originalname)
            .toLowerCase();

        const nome =
            `gerente-${Date.now()}${extensao}`;

        cb(null, nome);

    }

});


const upload = multer({

    storage: storage,

    fileFilter: (req, file, cb) => {

        const permitidos = [
            '.jpg',
            '.jpeg',
            '.png',
            '.webp'
        ];

        const extensao = path
            .extname(file.originalname)
            .toLowerCase();


        if (!permitidos.includes(extensao)) {

            return cb(
                new Error(
                    'Formato de imagem não permitido. Use JPG, PNG ou WEBP.'
                )
            );

        }

        cb(null, true);

    },

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


// =====================================================
// BUSCAR
// =====================================================

router.get(
    '/',
    gerenteController.buscar
);


// =====================================================
// EDITAR + FOTO
// =====================================================

router.put(
    '/:id',
    upload.single('foto'),
    gerenteController.atualizar
);


// =====================================================
// EXCLUIR
// =====================================================

router.delete(
    '/:id',
    gerenteController.excluir
);


module.exports = router;