const multer = require('multer');
const path = require('path');
const fs = require('fs');

const pastaImagens = path.join(
    __dirname,
    '../../frontend/images'
);

if (!fs.existsSync(pastaImagens)) {
    fs.mkdirSync(pastaImagens, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, pastaImagens);
    },

    filename: (req, file, cb) => {

        const extensao =
            path.extname(file.originalname).toLowerCase();

        const nome =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extensao}`;

        cb(null, nome);
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
            path.extname(file.originalname).toLowerCase();

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

module.exports = upload;