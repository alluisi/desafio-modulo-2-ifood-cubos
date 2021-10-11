const express = require('express');
const movimentacao = require('./controladores/movimentacao');


const rotas = express();

rotas.get('/contas', movimentacao.listarContas);
rotas.post('/contas', movimentacao.criarConta);
rotas.put('/contas/:numeroConta/usuario', movimentacao.atualizarUsuarioConta);
rotas.delete('/contas/:numeroConta', movimentacao.excluirConta);
rotas.post('/transacoes/depositar', movimentacao.depositar);
rotas.post('/transacoes/sacar', movimentacao.sacar);
rotas.post('/transacoes/transferir', movimentacao.transferir);
rotas.get('/contas/saldo', movimentacao.saldo);
rotas.get('/contas/extrato', movimentacao.extrato);

module.exports = rotas;