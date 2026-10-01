# 🐎 Sistema de Gerenciamento — Haras Bela Vista

## Meu Projeto

Neste projeto desenvolvi um sistema de gerenciamento para o **Haras Bela Vista**, com o objetivo de facilitar o controle das principais informações e atividades do haras.

O sistema permite gerenciar cavalos, proprietários, clientes, equipamentos, passeios, baias, raças, produtos do shop e informações do gerente, além de disponibilizar relatórios para auxiliar no acompanhamento das atividades do estabelecimento.

O projeto foi desenvolvido utilizando **Front-end e Back-end**, com integração a um banco de dados **PostgreSQL**, permitindo cadastrar, consultar, editar e excluir informações de forma organizada.

---

## Funcionalidades

- Cadastrar, visualizar, editar e excluir cavalos;
- Cadastrar, visualizar, editar e excluir proprietários;
- Cadastrar, visualizar, editar e excluir clientes;
- Cadastrar, visualizar, editar e excluir equipamentos;
- Adicionar fotos aos equipamentos e proprietários;
- Associar equipamentos aos cavalos;
- Cadastrar e consultar passeios;
- Registrar informações dos clientes e seus passeios;
- Controlar as baias do haras;
- Cadastrar e consultar raças de cavalos;
- Gerenciar produtos disponíveis no Shop;
- Registrar compras e vendas do Shop;
- Gerenciar informações do gerente;
- Visualizar relatórios do sistema;
- Consultar informações armazenadas no banco de dados PostgreSQL.

---

## 🛠️ Tecnologias Utilizadas

### Front-end

- HTML5
- CSS3
- JavaScript

### Back-end

- Node.js
- Express
- Multer
- CORS
- dotenv

### Banco de Dados

- PostgreSQL

### Ferramentas

- Visual Studio Code
- PostgreSQL
- pgAdmin 4
- Git
- GitHub

---

# 🗄️ Banco de Dados

O sistema utiliza o **PostgreSQL** para armazenar as informações do Haras Bela Vista.

O banco de dados foi desenvolvido utilizando diferentes tabelas relacionadas entre si, permitindo representar as principais entidades e atividades do sistema.

## Principais tabelas

### Tabela: gerente

Armazena as informações do gerente responsável pelo haras.

| Campo | Tipo |
| --- | --- |
| id_gerente | SERIAL PRIMARY KEY |
| nome | VARCHAR(150) |
| cargo | VARCHAR(100) |
| email | VARCHAR(150) |
| telefone | VARCHAR(20) |
| cidade | VARCHAR(100) |

---

### Tabela: proprietario

Armazena os dados dos proprietários dos cavalos.

| Campo | Tipo |
| --- | --- |
| id_proprietario | SERIAL PRIMARY KEY |
| nome | VARCHAR |
| telefone | VARCHAR |
| email | VARCHAR |
| cidade | VARCHAR |
| foto | VARCHAR |

---

### Tabela: raca

Armazena as raças cadastradas no sistema.

| Campo | Tipo |
| --- | --- |
| id_raca | SERIAL PRIMARY KEY |
| nome | VARCHAR |

---

### Tabela: baia

Representa as baias utilizadas pelos cavalos do haras.

| Campo | Tipo |
| --- | --- |
| id_baia | SERIAL PRIMARY KEY |
| numero | INTEGER |
| placa | VARCHAR |
| tamanho | VARCHAR |
| situacao | VARCHAR |

---

### Tabela: cavalo

Armazena as informações dos cavalos cadastrados.

| Campo | Tipo |
| --- | --- |
| id_cavalo | SERIAL PRIMARY KEY |
| nome | VARCHAR |
| sexo | VARCHAR |
| idade | INTEGER |
| id_raca | INTEGER |
| id_proprietario | INTEGER |
| id_baia | INTEGER |
| disponivel | BOOLEAN |

---

### Tabela: cliente

Armazena os dados dos clientes do haras.

| Campo | Tipo |
| --- | --- |
| id_cliente | SERIAL PRIMARY KEY |
| nome | VARCHAR |
| email | VARCHAR |
| telefone | VARCHAR |
| cidade | VARCHAR |

---

### Tabela: equipamento

Armazena os equipamentos disponíveis para utilização ou aluguel.

| Campo | Tipo |
| --- | --- |
| id_equipamento | SERIAL PRIMARY KEY |
| tipo | VARCHAR |
| valor_aluguel | NUMERIC |
| situacao | VARCHAR |
| id_cavalo | INTEGER |
| foto | VARCHAR |

---

### Tabela: passeio

Armazena os passeios realizados pelos clientes.

| Campo | Tipo |
| --- | --- |
| id_passeio | SERIAL PRIMARY KEY |
| id_cliente | INTEGER |
| id_cavalo | INTEGER |
| data | DATE |
| horario | TIME |
| duracao | INTEGER |
| valor | NUMERIC |
| motivo | VARCHAR |

---

### Tabela: produto

Armazena os produtos disponíveis no Shop do haras.

| Campo | Tipo |
| --- | --- |
| id_produto | SERIAL PRIMARY KEY |
| nome | VARCHAR |
| descricao | VARCHAR |
| preco | NUMERIC |
| quantidade | INTEGER |

---

### Tabela: compra

Registra as compras realizadas no Shop.

| Campo | Tipo |
| --- | --- |
| id_compra | SERIAL PRIMARY KEY |
| data | DATE |
| valor_total | NUMERIC |
| forma_pagamento | VARCHAR |

---

### Tabela: item_compra

Relaciona os produtos às compras realizadas.

| Campo | Tipo |
| --- | --- |
| id_item_compra | SERIAL PRIMARY KEY |
| id_compra | INTEGER |
| id_produto | INTEGER |
| quantidade | INTEGER |
| valor_unitario | NUMERIC |

---

# 🔗 Relacionamentos

O banco de dados utiliza relacionamentos entre as tabelas para representar as informações do sistema.

Alguns dos principais relacionamentos são:

- Um **proprietário** pode possuir vários cavalos;
- Um **cavalo** pertence a um proprietário;
- Uma **raça** pode estar associada a vários cavalos;
- Um **cavalo** está associado a uma baia;
- Um **cavalo** pode possuir equipamentos associados;
- Um **cliente** pode realizar vários passeios;
- Um **cavalo** pode participar de vários passeios;
- Uma **compra** pode possuir vários itens;
- Um **produto** pode aparecer em vários itens de compra.

Os relacionamentos foram estruturados utilizando **chaves primárias e chaves estrangeiras**, de acordo com a modelagem do banco de dados.

---

# 🌐 Rotas da API

O Back-end foi desenvolvido utilizando **Node.js e Express**, organizado em arquivos de rotas e controllers.

## Cavalos

| Método | Rota | Função |
| --- | --- | --- |
| GET | /cavalo | Lista os cavalos |
| GET | /cavalo/:id | Busca um cavalo |
| POST | /cavalo | Cadastra um cavalo |
| PUT | /cavalo/:id | Edita um cavalo |
| DELETE | /cavalo/:id | Exclui um cavalo |

## Proprietários

| Método | Rota | Função |
| --- | --- | --- |
| GET | /proprietarios | Lista os proprietários |
| GET | /proprietarios/:id | Busca um proprietário |
| POST | /proprietarios | Cadastra um proprietário |
| PUT | /proprietarios/:id | Edita um proprietário |
| DELETE | /proprietarios/:id | Exclui um proprietário |

## Equipamentos

| Método | Rota | Função |
| --- | --- | --- |
| GET | /equipamentos | Lista os equipamentos |
| GET | /equipamentos/:id | Busca um equipamento |
| POST | /equipamentos | Cadastra um equipamento |
| PUT | /equipamentos/:id | Edita um equipamento |
| DELETE | /equipamentos/:id | Exclui um equipamento |

## Clientes

| Método | Rota | Função |
| --- | --- | --- |
| GET | /clientes | Lista os clientes |
| GET | /clientes/:id | Busca um cliente |
| POST | /clientes | Cadastra um cliente |
| PUT | /clientes/:id | Edita um cliente |
| DELETE | /clientes/:id | Exclui um cliente |

## Passeios

| Método | Rota | Função |
| --- | --- | --- |
| GET | /passeios | Lista os passeios |
| GET | /passeios/:id | Busca um passeio |
| POST | /passeios | Cadastra um passeio |
| PUT | /passeios/:id | Edita um passeio |
| DELETE | /passeios/:id | Exclui um passeio |

## Produtos

| Método | Rota | Função |
| --- | --- | --- |
| GET | /produtos | Lista os produtos |
| GET | /produtos/:id | Busca um produto |
| POST | /produtos | Cadastra um produto |
| PUT | /produtos/:id | Edita um produto |
| DELETE | /produtos/:id | Exclui um produto |

## Compras

| Método | Rota | Função |
| --- | --- | --- |
| GET | /compras | Lista as compras |
| POST | /compras | Registra uma compra |
| DELETE | /compras/:id | Exclui uma compra |

## Baias

| Método | Rota | Função |
| --- | --- | --- |
| GET | /baias | Lista as baias |
| GET | /baias/:id | Busca uma baia |
| POST | /baias | Cadastra uma baia |
| PUT | /baias/:id | Edita uma baia |
| DELETE | /baias/:id | Exclui uma baia |

## Raças

| Método | Rota | Função |
| --- | --- | --- |
| GET | /racas | Lista as raças |
| GET | /racas/:id | Busca uma raça |
| POST | /racas | Cadastra uma raça |
| PUT | /racas/:id | Edita uma raça |
| DELETE | /racas/:id | Exclui uma raça |

## Gerente

| Método | Rota | Função |
| --- | --- | --- |
| GET | /gerente | Lista os gerentes |
| GET | /gerente/:id | Busca um gerente |
| POST | /gerente | Cadastra um gerente |
| PUT | /gerente/:id | Edita um gerente |
| DELETE | /gerente/:id | Exclui um gerente |

---

# 📸 Upload de Fotos

O sistema permite o cadastro de fotos em algumas entidades, como proprietários e equipamentos.

Para realizar o upload das imagens foi utilizado o **Multer**.

As imagens são armazenadas na pasta:

```text
frontend/images/
