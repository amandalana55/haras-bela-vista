const pool = require('../db');

async function listarProdutos(req, res) {
    try {
        const resultado = await pool.query(`
            SELECT
                id_produto,
                nome,
                categoria,
                descricao,
                preco_venda,
                quantidade_estoque,
                estoque_minimo
            FROM produto
            ORDER BY nome;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);
        res.status(500).json({
            erro: 'Não foi possível buscar os produtos.'
        });
    }
}

async function cadastrarProduto(req, res) {
    try {
        const {
            nome,
            categoria,
            descricao,
            preco_venda,
            quantidade_estoque,
            estoque_minimo
        } = req.body;

        const resultado = await pool.query(`
            INSERT INTO produto
            (
                nome,
                categoria,
                descricao,
                preco_venda,
                quantidade_estoque,
                estoque_minimo
            )
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *;
        `, [
            nome,
            categoria,
            descricao || null,
            Number(preco_venda),
            Number(quantidade_estoque) || 0,
            Number(estoque_minimo) || 0
        ]);

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao cadastrar produto:', erro);
        res.status(500).json({
            erro: erro.message
        });
    }
}

async function editarProduto(req, res) {
    try {
        const {
            nome,
            categoria,
            descricao,
            preco_venda,
            quantidade_estoque,
            estoque_minimo
        } = req.body;

        const resultado = await pool.query(`
            UPDATE produto
            SET
                nome = $1,
                categoria = $2,
                descricao = $3,
                preco_venda = $4,
                quantidade_estoque = $5,
                estoque_minimo = $6
            WHERE id_produto = $7
            RETURNING *;
        `, [
            nome,
            categoria,
            descricao || null,
            Number(preco_venda),
            Number(quantidade_estoque),
            Number(estoque_minimo),
            req.params.id
        ]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Produto não encontrado.'
            });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao editar produto:', erro);
        res.status(500).json({
            erro: erro.message
        });
    }
}

async function excluirProduto(req, res) {
    try {
        const resultado = await pool.query(`
            DELETE FROM produto
            WHERE id_produto = $1
            RETURNING id_produto;
        `, [req.params.id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Produto não encontrado.'
            });
        }

        res.json({
            mensagem: 'Produto excluído com sucesso.'
        });
    } catch (erro) {
        console.error('Erro ao excluir produto:', erro);
        res.status(500).json({
            erro: erro.message
        });
    }
}

module.exports = {
    listarProdutos,
    cadastrarProduto,
    editarProduto,
    excluirProduto
};