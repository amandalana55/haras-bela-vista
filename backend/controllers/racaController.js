const pool = require('../db');

async function listar(req, res) {

    try {

        const resultado = await pool.query(`
            SELECT
                id_raca,
                nome
            FROM raca
            ORDER BY nome;
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.error(
            'Erro ao buscar raças:',
            erro
        );

        res.status(500).json({
            erro: 'Não foi possível buscar as raças.'
        });

    }

}

module.exports = {
    listar
};