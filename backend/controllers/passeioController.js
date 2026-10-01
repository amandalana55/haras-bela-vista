const pool = require('../db');

async function listarPasseios(req, res) {
    try {
        const resultado = await pool.query(`
            SELECT
                p.id_passeio,
                p.data,
                p.horario_inicio,
                p.duracao,
                p.valor_passeio,
                p.valor_proprietario,
                p.valor_haras,
                p.forma_pagamento,
                p.observacao,
                c.id_cliente,
                c.nome AS cliente,
                cav.id_cavalo,
                cav.nome AS cavalo
            FROM passeio p
            JOIN cliente c
                ON p.id_cliente = c.id_cliente
            JOIN cavalo cav
                ON p.id_cavalo = cav.id_cavalo
            ORDER BY
                p.data DESC,
                p.horario_inicio DESC;
        `);

        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar passeios:', erro);
        res.status(500).json({
            erro: 'Não foi possível buscar os passeios.'
        });
    }
}

async function cadastrarPasseio(req, res) {
    try {
        const {
            id_cliente,
            id_cavalo,
            data,
            horario_inicio,
            duracao,
            valor_passeio,
            forma_pagamento,
            observacao
        } = req.body;

        const valor = Number(valor_passeio);
        const duracaoNumero = Number(duracao);

        if (!id_cliente || !id_cavalo || !data ||
            !horario_inicio || !duracao || !valor_passeio) {
            return res.status(400).json({
                erro: 'Preencha todos os campos obrigatórios.'
            });
        }

        if (duracaoNumero <= 0 || duracaoNumero > 3) {
            return res.status(400).json({
                erro: 'O passeio deve ter no máximo 3 horas.'
            });
        }

        if (valor <= 0) {
            return res.status(400).json({
                erro: 'O valor do passeio deve ser maior que zero.'
            });
        }

        const resultado = await pool.query(`
            INSERT INTO passeio
            (
                id_cliente,
                id_cavalo,
                data,
                horario_inicio,
                duracao,
                valor_passeio,
                valor_proprietario,
                valor_haras,
                forma_pagamento,
                observacao
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *;
        `, [
            id_cliente,
            id_cavalo,
            data,
            horario_inicio,
            duracaoNumero,
            valor,
            valor * 0.5,
            valor * 0.5,
            forma_pagamento,
            observacao || null
        ]);

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao cadastrar passeio:', erro);
        res.status(500).json({
            erro: erro.message
        });
    }
}

async function editarPasseio(req, res) {
    try {
        const {
            id_cliente,
            id_cavalo,
            data,
            horario_inicio,
            duracao,
            valor_passeio,
            forma_pagamento,
            observacao
        } = req.body;

        const valor = Number(valor_passeio);
        const duracaoNumero = Number(duracao);

        if (duracaoNumero <= 0 || duracaoNumero > 3) {
            return res.status(400).json({
                erro: 'O passeio deve ter no máximo 3 horas.'
            });
        }

        const resultado = await pool.query(`
            UPDATE passeio
            SET
                id_cliente = $1,
                id_cavalo = $2,
                data = $3,
                horario_inicio = $4,
                duracao = $5,
                valor_passeio = $6,
                valor_proprietario = $7,
                valor_haras = $8,
                forma_pagamento = $9,
                observacao = $10
            WHERE id_passeio = $11
            RETURNING *;
        `, [
            id_cliente,
            id_cavalo,
            data,
            horario_inicio,
            duracaoNumero,
            valor,
            valor * 0.5,
            valor * 0.5,
            forma_pagamento,
            observacao || null,
            req.params.id
        ]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Passeio não encontrado.'
            });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao editar passeio:', erro);
        res.status(500).json({
            erro: erro.message
        });
    }
}

async function excluirPasseio(req, res) {
    try {
        const resultado = await pool.query(`
            DELETE FROM passeio
            WHERE id_passeio = $1
            RETURNING id_passeio;
        `, [req.params.id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Passeio não encontrado.'
            });
        }

        res.json({
            mensagem: 'Passeio excluído com sucesso.'
        });
    } catch (erro) {
        console.error('Erro ao excluir passeio:', erro);
        res.status(500).json({
            erro: erro.message
        });
    }
}

module.exports = {
    listarPasseios,
    cadastrarPasseio,
    editarPasseio,
    excluirPasseio
};