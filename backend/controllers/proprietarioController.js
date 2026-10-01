const pool = require('../db');


// =====================================================
// LISTAR PROPRIETÁRIOS
// =====================================================

async function listar(req, res) {

    try {

        const resultado = await pool.query(`
            SELECT
                id_proprietario,
                nome,
                telefone,
                email,
                cidade,
                foto
            FROM proprietario
            ORDER BY id_proprietario;
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.error(
            'Erro ao listar proprietários:',
            erro
        );

        res.status(500).json({
            erro: 'Não foi possível carregar os proprietários.'
        });

    }

}


// =====================================================
// BUSCAR UM PROPRIETÁRIO
// =====================================================

async function buscarPorId(req, res) {

    try {

        const { id } = req.params;

        const resultado = await pool.query(`
            SELECT
                id_proprietario,
                nome,
                telefone,
                email,
                cidade,
                foto
            FROM proprietario
            WHERE id_proprietario = $1;
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Proprietário não encontrado.'
            });

        }

        res.json(resultado.rows[0]);

    } catch (erro) {

        console.error(
            'Erro ao buscar proprietário:',
            erro
        );

        res.status(500).json({
            erro: 'Não foi possível carregar o proprietário.'
        });

    }

}


// =====================================================
// CRIAR PROPRIETÁRIO
// =====================================================

async function criar(req, res) {

    try {

        const {
            nome,
            telefone,
            email,
            cidade
        } = req.body || {};


        if (!nome || !email || !cidade) {

            return res.status(400).json({
                erro: 'Nome, email e cidade são obrigatórios.'
            });

        }


        const foto =
            req.file
                ? `/images/${req.file.filename}`
                : null;


        const resultado = await pool.query(`
            INSERT INTO proprietario
            (
                nome,
                telefone,
                email,
                cidade,
                foto
            )

            VALUES
            ($1, $2, $3, $4, $5)

            RETURNING
                id_proprietario,
                nome,
                telefone,
                email,
                cidade,
                foto;
        `, [
            nome,
            telefone || null,
            email,
            cidade,
            foto
        ]);


        res.status(201).json(
            resultado.rows[0]
        );

    } catch (erro) {

        console.error(
            'Erro ao criar proprietário:',
            erro
        );

        res.status(500).json({
            erro: erro.message
        });

    }

}


// =====================================================
// ATUALIZAR PROPRIETÁRIO
// =====================================================

async function atualizar(req, res) {

    try {

        const { id } = req.params;

        const {
            nome,
            telefone,
            email,
            cidade
        } = req.body || {};


        if (!nome || !email || !cidade) {

            return res.status(400).json({
                erro: 'Nome, email e cidade são obrigatórios.'
            });

        }


        let resultado;


        // -------------------------------------------------
        // COM NOVA FOTO
        // -------------------------------------------------

        if (req.file) {

            const foto =
                `/images/${req.file.filename}`;


            resultado = await pool.query(`
                UPDATE proprietario

                SET
                    nome = $1,
                    telefone = $2,
                    email = $3,
                    cidade = $4,
                    foto = $5

                WHERE id_proprietario = $6

                RETURNING
                    id_proprietario,
                    nome,
                    telefone,
                    email,
                    cidade,
                    foto;
            `, [
                nome,
                telefone || null,
                email,
                cidade,
                foto,
                id
            ]);

        }

        // -------------------------------------------------
        // SEM NOVA FOTO
        // -------------------------------------------------

        else {

            resultado = await pool.query(`
                UPDATE proprietario

                SET
                    nome = $1,
                    telefone = $2,
                    email = $3,
                    cidade = $4

                WHERE id_proprietario = $5

                RETURNING
                    id_proprietario,
                    nome,
                    telefone,
                    email,
                    cidade,
                    foto;
            `, [
                nome,
                telefone || null,
                email,
                cidade,
                id
            ]);

        }


        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Proprietário não encontrado.'
            });

        }


        res.json(
            resultado.rows[0]
        );

    } catch (erro) {

        console.error(
            'Erro ao atualizar proprietário:',
            erro
        );

        res.status(500).json({
            erro: erro.message
        });

    }

}


// =====================================================
// EXCLUIR PROPRIETÁRIO
// =====================================================

async function excluir(req, res) {

    try {

        const { id } = req.params;


        const resultado = await pool.query(`
            DELETE FROM proprietario
            WHERE id_proprietario = $1
            RETURNING id_proprietario;
        `, [id]);


        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Proprietário não encontrado.'
            });

        }


        res.json({
            mensagem: 'Proprietário excluído com sucesso.'
        });

    } catch (erro) {

        console.error(
            'Erro ao excluir proprietário:',
            erro
        );

        res.status(500).json({
            erro: erro.message
        });

    }

}


// =====================================================
// EXPORTAR
// =====================================================

module.exports = {

    listar,
    buscarPorId,
    criar,
    atualizar,
    excluir

};