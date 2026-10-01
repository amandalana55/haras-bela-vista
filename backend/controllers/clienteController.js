const pool = require('../db');
const path = require('path');
const fs = require('fs');

const imagensPath = path.join(
    __dirname,
    '../../frontend/images'
);


// LISTAR CLIENTES
async function listarClientes(req, res) {

    try {

        const resultado = await pool.query(`
            SELECT
                id_cliente,
                nome,
                telefone,
                email,
                cidade,
                contato_emergencia,
                telefone_emergencia,
                foto
            FROM cliente
            ORDER BY nome;
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.error('Erro ao listar clientes:', erro);

        res.status(500).json({
            erro: 'Não foi possível buscar os clientes.'
        });

    }

}


// BUSCAR CLIENTE
async function buscarCliente(req, res) {

    try {

        const resultado = await pool.query(`
            SELECT
                id_cliente,
                nome,
                telefone,
                email,
                cidade,
                contato_emergencia,
                telefone_emergencia,
                foto
            FROM cliente
            WHERE id_cliente = $1;
        `, [req.params.id]);


        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Cliente não encontrado.'
            });

        }


        res.json(resultado.rows[0]);

    } catch (erro) {

        console.error('Erro ao buscar cliente:', erro);

        res.status(500).json({
            erro: 'Não foi possível buscar o cliente.'
        });

    }

}


// CADASTRAR CLIENTE
async function cadastrarCliente(req, res) {

    try {

        const {
            nome,
            telefone,
            email,
            cidade,
            contato_emergencia,
            telefone_emergencia
        } = req.body;


        if (!nome || !email || !cidade) {

            return res.status(400).json({
                erro: 'Nome, e-mail e cidade são obrigatórios.'
            });

        }


        const foto = req.file
            ? req.file.filename
            : null;


        const resultado = await pool.query(`
            INSERT INTO cliente
            (
                nome,
                telefone,
                email,
                cidade,
                contato_emergencia,
                telefone_emergencia,
                foto
            )

            VALUES
            ($1,$2,$3,$4,$5,$6,$7)

            RETURNING *;
        `, [

            nome,
            telefone,
            email,
            cidade,
            contato_emergencia || null,
            telefone_emergencia || null,
            foto

        ]);


        res.status(201).json(
            resultado.rows[0]
        );

    } catch (erro) {

        console.error('Erro ao cadastrar cliente:', erro);

        res.status(500).json({
            erro: erro.message
        });

    }

}


// EDITAR CLIENTE
async function editarCliente(req, res) {

    try {

        const id = req.params.id;


        const {
            nome,
            telefone,
            email,
            cidade,
            contato_emergencia,
            telefone_emergencia
        } = req.body;


        const atual = await pool.query(`
            SELECT foto
            FROM cliente
            WHERE id_cliente = $1;
        `, [id]);


        if (atual.rows.length === 0) {

            return res.status(404).json({
                erro: 'Cliente não encontrado.'
            });

        }


        let foto = atual.rows[0].foto;


        if (req.file) {

            if (foto) {

                const caminhoAntigo = path.join(
                    imagensPath,
                    foto
                );


                if (fs.existsSync(caminhoAntigo)) {

                    fs.unlinkSync(
                        caminhoAntigo
                    );

                }

            }


            foto = req.file.filename;

        }


        const resultado = await pool.query(`
            UPDATE cliente

            SET
                nome = $1,
                telefone = $2,
                email = $3,
                cidade = $4,
                contato_emergencia = $5,
                telefone_emergencia = $6,
                foto = $7

            WHERE id_cliente = $8

            RETURNING *;
        `, [

            nome,
            telefone,
            email,
            cidade,
            contato_emergencia || null,
            telefone_emergencia || null,
            foto,
            id

        ]);


        res.json(
            resultado.rows[0]
        );

    } catch (erro) {

        console.error('Erro ao editar cliente:', erro);

        res.status(500).json({
            erro: erro.message
        });

    }

}


// EXCLUIR CLIENTE
async function excluirCliente(req, res) {

    try {

        const resultado = await pool.query(`
            DELETE FROM cliente

            WHERE id_cliente = $1

            RETURNING foto;
        `, [req.params.id]);


        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Cliente não encontrado.'
            });

        }


        const foto =
            resultado.rows[0].foto;


        if (foto) {

            const caminho = path.join(
                imagensPath,
                foto
            );


            if (fs.existsSync(caminho)) {

                fs.unlinkSync(caminho);

            }

        }


        res.json({

            mensagem:
                'Cliente excluído com sucesso.'

        });

    } catch (erro) {

        console.error('Erro ao excluir cliente:', erro);

        res.status(500).json({
            erro: erro.message
        });

    }

}


module.exports = {

    listarClientes,
    buscarCliente,
    cadastrarCliente,
    editarCliente,
    excluirCliente

};