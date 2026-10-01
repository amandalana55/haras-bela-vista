const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

require('dotenv').config();

const app = express();


// =====================================================
// MIDDLEWARES
// =====================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =====================================================
// FRONTEND
// =====================================================

const frontendPath = path.join(__dirname, '../frontend');

const imagensPath = path.join(
    frontendPath,
    'images'
);

if (!fs.existsSync(imagensPath)) {
    fs.mkdirSync(imagensPath, {
        recursive: true
    });
}

app.use(
    '/images',
    express.static(imagensPath)
);

app.use(
    express.static(frontendPath)
);

app.get('/', (req, res) => {
    res.sendFile(
        path.join(frontendPath, 'index.html')
    );
});


// =====================================================
// MULTER
// =====================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, imagensPath);
    },

    filename: (req, file, cb) => {

        const extensao = path
            .extname(file.originalname)
            .toLowerCase();

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
// BANCO
// =====================================================

const pool = require('./db');


// =====================================================
// TESTE BANCO
// =====================================================

app.get('/teste-banco', async (req, res) => {

    try {

        const resultado = await pool.query(
            'SELECT NOW() AS horario'
        );

        res.json({
            mensagem: 'Banco de dados conectado!',
            horario: resultado.rows[0].horario
        });

    } catch (erro) {

        console.error(
            'Erro ao conectar ao banco:',
            erro
        );

        res.status(500).json({
            erro: 'Não foi possível conectar ao banco de dados.'
        });

    }

});


// =====================================================
// ROTAS
// =====================================================

const cavaloRoutes =
    require('./routes/cavaloRoutes');

const equipamentoRoutes =
    require('./routes/equipamentoRoutes');

const passeioRoutes =
    require('./routes/passeioRoutes');

const clienteRoutes =
    require('./routes/clienteRoutes');

const proprietarioRoutes =
    require('./routes/proprietarioRoutes');

const produtoRoutes =
    require('./routes/produtoRoutes');

const compraRoutes =
    require('./routes/compraRoutes');

const relatorioRoutes =
    require('./routes/relatorioRoutes');

const racaRoutes =
    require('./routes/racaRoutes');

const baiaRoutes =
    require('./routes/baiaRoutes');

const gerenteRoutes =
    require('./routes/gerenteRoutes');


// =====================================================
// REGISTRO DAS ROTAS
// =====================================================

app.use(
    '/cavalo',
    cavaloRoutes
);

app.use(
    '/equipamentos',
    equipamentoRoutes
);

app.use(
    '/passeios',
    passeioRoutes
);

app.use(
    '/clientes',
    clienteRoutes
);

app.use(
    '/proprietarios',
    proprietarioRoutes
);

app.use(
    '/produtos',
    produtoRoutes
);

app.use(
    '/compras',
    compraRoutes
);

app.use(
    '/relatorios',
    relatorioRoutes
);

app.use(
    '/racas',
    racaRoutes
);

app.use(
    '/baias',
    baiaRoutes
);

app.use(
    '/gerente',
    gerenteRoutes
);
// =====================================================
// 404
// =====================================================

app.use((req, res) => {

    res.status(404).json({
        erro: 'Rota não encontrada.'
    });

});


// =====================================================
// ERROS
// =====================================================

app.use((erro, req, res, next) => {

    if (erro instanceof multer.MulterError) {

        if (erro.code === 'LIMIT_FILE_SIZE') {

            return res.status(400).json({
                erro: 'A imagem deve ter no máximo 5 MB.'
            });

        }

        return res.status(400).json({
            erro: erro.message
        });

    }

    if (erro) {

        console.error(
            'Erro no servidor:',
            erro
        );

        return res.status(400).json({
            erro: erro.message
        });

    }

    next();

});


// =====================================================
// SERVIDOR
// =====================================================

const PORT =
    process.env.PORT || 3001;

app.listen(PORT, () => {

    console.log('');
    console.log('========================================');
    console.log('🐎 HARAS BELA VISTA');
    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );
    console.log('========================================');

});