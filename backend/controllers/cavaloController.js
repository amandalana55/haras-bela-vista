const pool = require('../db');
const path = require('path');
const fs = require('fs');


// =====================================================
// LISTAR CAVALOS
// =====================================================

async function listar(req, res) {

    try {

        const resultado = await pool.query(`
            SELECT
                c.id_cavalo,
                c.nome,
                c.id_raca,
                r.nome AS raca,
                c.sexo,
                c.data_nascimento,
                c.pelagem,
                c.foto,
                c.disponibilidade,
                c.id_proprietario,
                p.nome AS proprietario,
                c.id_baia,
                b.numero AS baia,
                b.placa AS placa_baia

            FROM cavalo c

            JOIN raca r
                ON c.id_raca = r.id_raca

            JOIN proprietario p
                ON c.id_proprietario = p.id_proprietario

            JOIN baia b
                ON c.id_baia = b.id_baia

            ORDER BY c.nome;
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.error(
            'Erro ao buscar cavalos:',
            erro
        );

        res.status(500).json({
            erro: 'Não foi possível buscar os cavalos.'
        });

    }
}


// =====================================================
// BUSCAR POR ID
// =====================================================

async function buscarPorId(req, res) {

    try {

        const resultado = await pool.query(`
            SELECT
                c.id_cavalo,
                c.nome,
                c.id_raca,
                r.nome AS raca,
                c.sexo,
                c.data_nascimento,
                c.pelagem,
                c.foto,
                c.disponibilidade,
                c.id_proprietario,
                p.nome AS proprietario,
                c.id_baia,
                b.numero AS baia,
                b.placa AS placa_baia

            FROM cavalo c

            JOIN raca r
                ON c.id_raca = r.id_raca

            JOIN proprietario p
                ON c.id_proprietario = p.id_proprietario

            JOIN baia b
                ON c.id_baia = b.id_baia

            WHERE c.id_cavalo = $1;
        `, [req.params.id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Cavalo não encontrado.'
            });

        }

        res.json(resultado.rows[0]);

    } catch (erro) {

        console.error(
            'Erro ao buscar cavalo:',
            erro
        );

        res.status(500).json({
            erro: 'Não foi possível buscar o cavalo.'
        });

    }
}


// =====================================================
// CADASTRAR
// =====================================================

async function cadastrar(req, res) {

    try {

        const {
            nome,
            id_raca,
            sexo,
            data_nascimento,
            pelagem,
            disponibilidade,
            id_proprietario,
            id_baia
        } = req.body;

        const foto =
            req.file
                ? req.file.filename
                : null;

        const resultado = await pool.query(`
            INSERT INTO cavalo
            (
                nome,
                id_raca,
                sexo,
                data_nascimento,
                pelagem,
                foto,
                disponibilidade,
                id_proprietario,
                id_baia
            )

            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9)

            RETURNING *;
        `, [
            nome,
            id_raca,
            sexo,
            data_nascimento || null,
            pelagem,
            foto,
            disponibilidade === 'false'
                ? false
                : true,
            id_proprietario,
            id_baia
        ]);

        res.status(201).json(
            resultado.rows[0]
        );

    } catch (erro) {

        console.error(
            'Erro ao cadastrar cavalo:',
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

        const id = req.params.id;

        const {
            nome,
            id_raca,
            sexo,
            data_nascimento,
            pelagem,
            disponibilidade,
            id_proprietario,
            id_baia
        } = req.body;


        const atual = await pool.query(`
            SELECT foto
            FROM cavalo
            WHERE id_cavalo = $1
        `, [id]);


        if (atual.rows.length === 0) {

            return res.status(404).json({
                erro: 'Cavalo não encontrado.'
            });

        }


        let foto =
            atual.rows[0].foto;


        if (req.file) {

            if (foto) {

                const caminhoAntigo =
                    path.join(
                        __dirname,
                        '../../frontend/images',
                        foto
                    );


                if (
                    fs.existsSync(caminhoAntigo)
                ) {

                    fs.unlinkSync(
                        caminhoAntigo
                    );

                }

            }


            foto =
                req.file.filename;

        }


        const resultado =
            await pool.query(`
                UPDATE cavalo

                SET
                    nome = $1,
                    id_raca = $2,
                    sexo = $3,
                    data_nascimento = $4,
                    pelagem = $5,
                    foto = $6,
                    disponibilidade = $7,
                    id_proprietario = $8,
                    id_baia = $9

                WHERE id_cavalo = $10

                RETURNING *;
            `, [
                nome,
                id_raca,
                sexo,
                data_nascimento || null,
                pelagem,
                foto,
                disponibilidade === 'false'
                    ? false
                    : true,
                id_proprietario,
                id_baia,
                id
            ]);


        res.json(
            resultado.rows[0]
        );

    } catch (erro) {

        console.error(
            'Erro ao editar cavalo:',
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

        const resultado =
            await pool.query(`
                DELETE FROM cavalo

                WHERE id_cavalo = $1

                RETURNING foto;
            `, [req.params.id]);


        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Cavalo não encontrado.'
            });

        }


        const foto =
            resultado.rows[0].foto;


        if (foto) {

            const caminho =
                path.join(
                    __dirname,
                    '../../frontend/images',
                    foto
                );


            if (
                fs.existsSync(caminho)
            ) {

                fs.unlinkSync(caminho);

            }

        }


        res.json({

            mensagem:
                'Cavalo excluído com sucesso.'

        });

    } catch (erro) {

        console.error(
            'Erro ao excluir cavalo:',
            erro
        );

        res.status(500).json({
            erro: erro.message
        });

    }
}


// =====================================================
// EXPORTAÇÃO
// =====================================================

module.exports = {

    listar,
    buscarPorId,
    cadastrar,
    editar,
    excluir

};