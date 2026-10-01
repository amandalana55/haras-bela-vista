const pool = require('../db');


// =====================================================
// LISTAR
// =====================================================

async function listar(req, res) {

    try {

        const resultado = await pool.query(`
            SELECT
                e.id_equipamento,
                e.tipo,
                e.valor_aluguel,
                e.situacao,
                e.id_cavalo,
                e.foto,
                c.nome AS cavalo

            FROM equipamento e

            LEFT JOIN cavalo c
                ON e.id_cavalo = c.id_cavalo

            ORDER BY e.id_equipamento;
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.error(
            'Erro ao buscar equipamentos:',
            erro
        );

        res.status(500).json({
            erro: 'Não foi possível buscar os equipamentos.'
        });

    }

}


// =====================================================
// BUSCAR POR ID
// =====================================================

async function buscarPorId(req, res) {

    try {

        const { id } = req.params;

        const resultado = await pool.query(`
            SELECT
                e.id_equipamento,
                e.tipo,
                e.valor_aluguel,
                e.situacao,
                e.id_cavalo,
                e.foto,
                c.nome AS cavalo

            FROM equipamento e

            LEFT JOIN cavalo c
                ON e.id_cavalo = c.id_cavalo

            WHERE e.id_equipamento = $1
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Equipamento não encontrado.'
            });

        }

        res.json(resultado.rows[0]);

    } catch (erro) {

        console.error(
            'Erro ao buscar equipamento:',
            erro
        );

        res.status(500).json({
            erro: 'Não foi possível carregar o equipamento.'
        });

    }

}


// =====================================================
// CADASTRAR
// =====================================================

async function cadastrar(req, res) {

    try {

        const {
            tipo,
            valor_aluguel,
            situacao,
            id_cavalo
        } = req.body || {};

        if (!tipo) {

            return res.status(400).json({
                erro: 'Informe o tipo do equipamento.'
            });

        }

        const valor = Number(valor_aluguel);

        if (isNaN(valor) || valor < 0) {

            return res.status(400).json({
                erro: 'Informe um valor de aluguel válido.'
            });

        }

        const foto =
            req.file
                ? req.file.filename
                : null;

        const resultado = await pool.query(`
            INSERT INTO equipamento
            (
                tipo,
                valor_aluguel,
                situacao,
                id_cavalo,
                foto
            )

            VALUES
            ($1, $2, $3, $4, $5)

            RETURNING *;
        `, [
            tipo,
            valor,
            situacao || 'Disponível',
            id_cavalo || null,
            foto
        ]);

        res.status(201).json(
            resultado.rows[0]
        );

    } catch (erro) {

        console.error(
            'Erro ao cadastrar equipamento:',
            erro
        );

        res.status(500).json({
            erro: erro.message
        });

    }

}


// =====================================================
// EDITAR
// =====================================================

async function editar(req, res) {

    try {

        const { id } = req.params;

        const {
            tipo,
            valor_aluguel,
            situacao,
            id_cavalo
        } = req.body || {};

        if (!tipo) {

            return res.status(400).json({
                erro: 'Informe o tipo do equipamento.'
            });

        }

        const valor = Number(valor_aluguel);

        if (isNaN(valor) || valor < 0) {

            return res.status(400).json({
                erro: 'Informe um valor de aluguel válido.'
            });

        }

        const atual = await pool.query(`
            SELECT foto
            FROM equipamento
            WHERE id_equipamento = $1
        `, [id]);

        if (atual.rows.length === 0) {

            return res.status(404).json({
                erro: 'Equipamento não encontrado.'
            });

        }

        let foto = atual.rows[0].foto;

        if (req.file) {
            foto = req.file.filename;
        }

        const resultado = await pool.query(`
            UPDATE equipamento

            SET
                tipo = $1,
                valor_aluguel = $2,
                situacao = $3,
                id_cavalo = $4,
                foto = $5

            WHERE id_equipamento = $6

            RETURNING *;
        `, [
            tipo,
            valor,
            situacao || 'Disponível',
            id_cavalo || null,
            foto,
            id
        ]);

        res.json(
            resultado.rows[0]
        );

    } catch (erro) {

        console.error(
            'Erro ao editar equipamento:',
            erro
        );

        res.status(500).json({
            erro: erro.message
        });

    }

}


// =====================================================
// EXCLUIR
// =====================================================

async function excluir(req, res) {

    try {

        const resultado = await pool.query(`
            DELETE FROM equipamento

            WHERE id_equipamento = $1

            RETURNING id_equipamento;
        `, [req.params.id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Equipamento não encontrado.'
            });

        }

        res.json({
            mensagem:
                'Equipamento excluído com sucesso.'
        });

    } catch (erro) {

        console.error(
            'Erro ao excluir equipamento:',
            erro
        );

        res.status(500).json({
            erro: erro.message
        });

    }

}


module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    editar,
    excluir
};