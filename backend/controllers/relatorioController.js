const pool = require('../db');

async function gerarRelatorios(req, res) {
    try {

        const resultado = await pool.query(`
            SELECT

                (
                    SELECT COUNT(*)
                    FROM cavalo
                ) AS total_cavalos,

                (
                    SELECT COUNT(*)
                    FROM passeio
                ) AS total_passeios,

                (
                    SELECT COUNT(*)
                    FROM cliente
                ) AS total_clientes,

                (
                    SELECT COUNT(*)
                    FROM proprietario
                ) AS total_proprietarios,

                (
                    SELECT COUNT(*)
                    FROM produto
                ) AS total_produtos,

                (
                    SELECT COALESCE(
                        SUM(valor_passeio),
                        0
                    )
                    FROM passeio
                ) AS total_passeios_valor,

                (
                    SELECT COALESCE(
                        SUM(valor_total),
                        0
                    )
                    FROM compra
                ) AS total_compras_valor,

                (
                    SELECT COUNT(*)
                    FROM produto
                    WHERE quantidade_estoque <= estoque_minimo
                ) AS produtos_estoque_baixo;
        `);

        res.json(resultado.rows[0]);

    } catch (erro) {

        console.error(
            'Erro ao gerar relatórios:',
            erro
        );

        res.status(500).json({
            erro: 'Não foi possível gerar os relatórios.'
        });
    }
}

module.exports = {
    gerarRelatorios
};