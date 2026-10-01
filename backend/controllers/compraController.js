const pool = require('../db');

async function listarCompras(req, res) {
    try {
        const resultado = await pool.query(`
            SELECT
                id_compra,
                data,
                hora,
                valor_total,
                forma_pagamento
            FROM compra
            ORDER BY
                data DESC,
                hora DESC;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar compras:', erro);
        res.status(500).json({
            erro: 'Não foi possível buscar as compras.'
        });
    }
}

module.exports = {
    listarCompras
};