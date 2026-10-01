const pool = require('../db');

// =====================================================
// LISTAR BAIAS
// =====================================================

async function listar(req, res) {

    try {

        const resultado = await pool.query(`
            SELECT
                id_baia,
                numero,
                placa,
                largura,
                comprimento,
                area_m2
            FROM baia
            ORDER BY numero;
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.error(
            'Erro ao buscar baias:',
            erro
        );

        res.status(500).json({
            erro: 'Não foi possível buscar as baias.'
        });

    }

}


// =====================================================
// EXPORTAÇÃO
// =====================================================

module.exports = {
    listar
};