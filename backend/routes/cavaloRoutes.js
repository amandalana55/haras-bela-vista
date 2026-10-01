const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const cavaloController = require('../controllers/cavaloController');


// =====================================================
// CAMINHO DAS IMAGENS
// =====================================================

const imagensPath = path.join(
    __dirname,
    '../../frontend/images'
);


// Cria a pasta caso ela não exista
if (!fs.existsSync(imagensPath)) {

    fs.mkdirSync(
        imagensPath,
        {
            recursive: true
        }
    );

}


// =====================================================
// CONFIGURAÇÃO DO UPLOAD
// =====================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            imagensPath
        );

    },

    filename: (req, file, cb) => {

        const extensao = path
            .extname(file.originalname)
            .toLowerCase();

        const nome =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extensao}`;

        cb(
            null,
            nome
        );

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
                    'Formato de imagem não permitido. Use JPG, JPEG, PNG ou WEBP.'
                )
            );

        }

        cb(
            null,
            true
        );

    },

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


// =====================================================
// ROTAS
// =====================================================


// LISTAR
router.get(
    '/',
    cavaloController.listar
);


// BUSCAR POR ID
router.get(
    '/:id',
    cavaloController.buscarPorId
);


// CADASTRAR
router.post(
    '/',
    upload.single('foto'),
    cavaloController.cadastrar
);


// EDITAR
router.put(
    '/:id',
    upload.single('foto'),
    cavaloController.editar
);


// EXCLUIR
router.delete(
    '/:id',
    cavaloController.excluir
);


// =====================================================
// EXPORTAR
// =====================================================

module.exports = router;