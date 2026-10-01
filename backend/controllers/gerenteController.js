const pool = require('../db');
const fs = require('fs');
const path = require('path');


// =====================================================
// BUSCAR GERENTE
// =====================================================

async function buscar(req, res) {

    try {

        const resultado = await pool.query(`
            SELECT
                id_gerente,
                nome,
                cargo,
                email,
                telefone,
                cidade,
                foto
            FROM gerente
            ORDER BY id_gerente
            LIMIT 1;
        `);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Gerente não encontrado.'
            });

        }

        res.json(resultado.rows[0]);

    } catch (erro) {

        console.error('Erro ao buscar gerente:', erro);

        res.status(500).json({
            erro: 'Não foi possível buscar o gerente.'
        });

    }

}


// =====================================================
// EDITAR GERENTE
// =====================================================

async function atualizar(req, res) {

    try {

        const { id } = req.params;

        const {
            nome,
            cargo,
            email,
            telefone,
            cidade
        } = req.body;


        if (!nome || !cargo || !email || !cidade) {

            return res.status(400).json({
                erro: 'Nome, cargo, email e cidade são obrigatórios.'
            });

        }


        // Busca a foto antiga
        const gerenteAtual = await pool.query(`
            SELECT foto
            FROM gerente
            WHERE id_gerente = $1
        `, [id]);


        if (gerenteAtual.rows.length === 0) {

            return res.status(404).json({
                erro: 'Gerente não encontrado.'
            });

        }


        let foto = gerenteAtual.rows[0].foto;


        // Se uma nova foto foi enviada
        if (req.file) {

            foto = req.file.filename;


            // Exclui a foto antiga
            if (gerenteAtual.rows[0].foto) {

                const caminhoFotoAntiga = path.join(
                    __dirname,
                    '../../frontend/images',
                    gerenteAtual.rows[0].foto
                );

                if (fs.existsSync(caminhoFotoAntiga)) {

                    fs.unlinkSync(caminhoFotoAntiga);

                }

            }

        }


        const resultado = await pool.query(`
            UPDATE gerente
            SET
                nome = $1,
                cargo = $2,
                email = $3,
                telefone = $4,
                cidade = $5,
                foto = $6
            WHERE id_gerente = $7
            RETURNING
                id_gerente,
                nome,
                cargo,
                email,
                telefone,
                cidade,
                foto;
        `, [
            nome,
            cargo,
            email,
            telefone || null,
            cidade,
            foto,
            id
        ]);


        res.json(resultado.rows[0]);


    } catch (erro) {

        console.error(
            'Erro ao atualizar gerente:',
            erro
        );

        res.status(500).json({
            erro: 'Não foi possível atualizar o gerente.'
        });

    }

}


// =====================================================
// EXCLUIR GERENTE
// =====================================================

async function excluir(req, res) {

    try {

        const { id } = req.params;


        const gerente = await pool.query(`
            SELECT foto
            FROM gerente
            WHERE id_gerente = $1
        `, [id]);


        if (gerente.rows.length === 0) {

            return res.status(404).json({
                erro: 'Gerente não encontrado.'
            });

        }


        const foto = gerente.rows[0].foto;


        const resultado = await pool.query(`
            DELETE FROM gerente
            WHERE id_gerente = $1
            RETURNING id_gerente;
        `, [id]);


        // Exclui a foto do computador
        if (foto) {

            const caminhoFoto = path.join(
                __dirname,
                '../../frontend/images',
                foto
            );

            if (fs.existsSync(caminhoFoto)) {

                fs.unlinkSync(caminhoFoto);

            }

        }


        res.json({
            mensagem: 'Gerente excluído com sucesso.'
        });


    } catch (erro) {

        console.error(
            'Erro ao excluir gerente:',
            erro
        );

        res.status(500).json({
            erro: 'Não foi possível excluir o gerente.'
        });

    }

}


module.exports = {
    buscar,
    atualizar,
    excluir
};