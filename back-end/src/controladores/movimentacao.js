const { contas, depositos, saques, transferencias } = require('../dados/bancodedados');
const validacao = require('./validacaoDeDados');
const { format } = require('date-fns');

function listarContas(req, res) {
    res.json(contas);
}

let proximoId = 1;

function criarConta(req, res) {
    const erro = validacao.validarDadosParaAbrirConta(req.body);

    if (erro) {
        res.status(400);
        res.json({ erro });
        return;
    }

    const novaConta = {
        numero: proximoId,
        saldo: 0,
        usuario: {
            nome: req.body.nome,
            cpf: req.body.cpf,
            data_nascimento: req.body.data_nascimento,
            telefone: req.body.telefone,
            email: req.body.email,
            senha: req.body.senha
        }
    }

    contas.push(novaConta);

    proximoId++;

    res.status(200);
    res.json(novaConta);
}

function atualizarUsuarioConta(req, res) {
    const conta = contas.find(conta => conta.numero === Number(req.params.numeroConta));

    if (!conta) {
        res.status(404);
        res.json({ "mensagem": `A conta ${req.params.numeroConta} não existe.` });
        return;
    }

    const erro = validacao.validarDadosParaAtualizarUsuario(req.body);
    if (erro) {
        res.status(400);
        res.json({ erro });
        return;
    }

    if (req.body.nome !== undefined) {
        conta.usuario.nome = req.body.nome;
    }

    if (req.body.cpf !== undefined) {
        conta.usuario.cpf = req.body.cpf;
    }

    if (req.body.data_nascimento !== undefined) {
        conta.usuario.data_nascimento = req.body.data_nascimento;
    }

    if (req.body.telefone !== undefined) {
        conta.usuario.telefone = req.body.telefone;
    }

    if (req.body.email !== undefined) {
        conta.usuario.email = req.body.email;
    }

    if (req.body.senha !== undefined) {
        conta.usuario.senha = req.body.senha;
    }

    res.status(201);
    res.json({ "mensagem": "Conta atualizada com sucesso!" });
}

function excluirConta(req, res) {
    const conta = contas.find(conta => conta.numero === Number(req.params.numeroConta));

    if (!conta) {
        res.status(404);
        res.json({ "mensagem": `A conta ${req.params.numeroConta} não existe.` });
        return;
    }

    const erro = validacao.validarDadosParaExcluirConta(req.params.numeroConta, conta);

    if (erro) {
        res.status(400);
        res.json({ erro });
        return;
    }

    const indice = contas.indexOf(conta);
    contas.splice(indice, 1);

    res.status(200);
    res.json({ "mensagem": "Conta excluída com sucesso!" });

}

function depositar(req, res) {
    const erro = validacao.validarDadosParaDepositar(req.body);

    if (erro) {
        res.status(400);
        res.json({ erro });
        return;
    }

    const conta = contas.find(conta => conta.numero === Number(req.body.numero));

    if (!conta) {
        res.status(404);
        res.json({ "mensagem": `A conta ${req.body.numero} não existe.` });
        return;
    }

    conta.saldo += req.body.valor;

    const date = new Date();
    const pattern = 'yyyy-MM-dd HH:mm:ss';
    const output = format(date, pattern);
    const deposito = {
        data: output,
        numero_conta: req.body.numero,
        valor: req.body.valor
    }

    depositos.push(deposito);

    res.status(200);
    res.json({ "mensagem": "Depósito realizado com sucesso!" });
}

function sacar(req, res) {
    const erro1 = validacao.validarDadosParaSacar1(req.body);

    if (erro1) {
        res.status(400);
        res.json({ erro1 });
        return;
    }

    const conta = contas.find(conta => conta.numero === Number(req.body.numero));

    if (!conta) {
        res.status(404);
        res.json({ "mensagem": `A conta ${req.body.numero} não existe.` });
        return;
    }

    const erro2 = validacao.validarDadosParaSacar2(req.body, conta);

    if (erro2) {
        res.status(400);
        res.json({ erro2 });
        return;
    }

    conta.saldo -= req.body.valor;

    const date = new Date();
    const pattern = 'yyyy-MM-dd HH:mm:ss';
    const output = format(date, pattern);
    const saque = {
        data: output,
        numero_conta: req.body.numero,
        valor: req.body.valor
    }

    saques.push(saque);

    res.status(200);
    res.json({ "mensagem": "Saque realizado com sucesso!" });
}

function transferir(req, res) {
    const erro1 = validacao.validarDadosParaTranferir1(req.body);

    if (erro1) {
        res.status(400);
        res.json({ erro1 });
        return;
    }

    const contaOrigem = contas.find(conta => conta.numero === Number(req.body.numero_origem));

    if (!contaOrigem) {
        res.status(404);
        res.json({ "mensagem": `A conta de origem ${req.body.numero_origem} não existe.` });
        return;
    }

    const contaDestino = contas.find(conta => conta.numero === Number(req.body.numero_destino));

    if (!contaDestino) {
        res.status(404);
        res.json({ "mensagem": `A conta de destino ${req.body.numero_destino} não existe.` });
        return;
    }

    const erro2 = validacao.validarDadosParaTranferir2(req.body, contaOrigem);

    if (erro2) {
        res.status(400);
        res.json({ erro2 });
        return;
    }

    contaOrigem.saldo -= req.body.valor;
    contaDestino.saldo += req.body.valor;

    const date = new Date();
    const pattern = 'yyyy-MM-dd HH:mm:ss';
    const output = format(date, pattern);
    const transferencia = {
        data: output,
        numero_conta_origem: req.body.numero_origem,
        numero_conta_destino: req.body.numero_destino,
        valor: req.body.valor
    }

    transferencias.push(transferencia);

    res.status(200);
    res.json({ "mensagem": "Tranferência realizada com sucesso!" });
}

function saldo(req, res) {
    const conta = contas.find(conta => conta.numero === Number(req.query.numero_conta));

    res.status(200);
    res.json({ "saldo": `${conta.saldo}` });
}

function extrato(req, res) {
    const conta = contas.find(conta => conta.numero === Number(req.query.numero_conta));

    let extratoDetalhado = {
        depositos: [],
        saques: [],
        transferenciasEnviadas: [],
        transferenciasRecebidas: []
    };

    for (let item of depositos) {
        if (Number(item.numero_conta) === conta.numero) {
            extratoDetalhado.depositos.push(item);
        }
    }

    for (let item of saques) {
        if (Number(item.numero_conta) === conta.numero) {
            extratoDetalhado.saques.push(item);
        }
    }

    for (let item of transferencias) {
        if (Number(item.numero_conta_origem) === conta.numero) {
            extratoDetalhado.transferenciasEnviadas.push(item);
        }
    }

    for (let item of transferencias) {
        if (Number(item.numero_conta_destino) === conta.numero) {
            extratoDetalhado.transferenciasRecebidas.push(item);
        }
    }

    res.status(200);
    res.json(extratoDetalhado);
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuarioConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}
