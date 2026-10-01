const express = require('express');
const multer = require('multer');
const path = require('path');

const {
    listarClientes,
    buscarCliente,
    cadastrarCliente,
    editarCliente,
    excluirCliente
} = require('../controllers/clienteController');

const router = express.Router();


const imagensPath = path.join(
    __dirname,
    '../../frontend/images'
);


const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, imagensPath);

    },

    filename: (req, file, cb) => {

        const extensao =
            path.extname(
                file.originalname
            ).toLowerCase();


        const nome =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extensao}`;


        cb(
            null,
            nome
        );

    }

});


const upload = multer({

    storage,

    fileFilter: (req, file, cb) => {

        const permitidos = [
            '.jpg',
            '.jpeg',
            '.png',
            '.webp'
        ];


        const extensao =
            path.extname(
                file.originalname
            ).toLowerCase();


        if (!permitidos.includes(extensao)) {

            return cb(
                new Error(
                    'Formato de imagem não permitido.'
                )
            );

        }


        cb(null, true);

    },

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


router.get(
    '/',
    listarClientes
);


router.get(
    '/:id',
    buscarCliente
);


router.post(
    '/',
    upload.single('foto'),
    cadastrarCliente
);


router.put(
    '/:id',
    upload.single('foto'),
    editarCliente
);


router.delete(
    '/:id',
    excluirCliente
);


module.exports = router;