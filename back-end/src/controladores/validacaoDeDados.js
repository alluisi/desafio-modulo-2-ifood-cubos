const { object } = require('yup');
const { contas } = require('../dados/bancodedados');

function validarDadosParaAbrirConta(conta) {
    for (let item of contas) {
        if (item.usuario.cpf === conta.cpf) {
            return 'Este CPF já possui conta em nosso banco.';
        }
    }

    for (let item of contas) {
        if (item.usuario.email === conta.email) {
            return 'Você já possui conta cadastrada com esse e-mail.';
        }
    }

    if (!conta.nome) {
        return 'O campo "nome" é obrigatório.'
    }

    if (!conta.cpf) {
        return 'O campo "cpf" é obrigatório.';
    }

    if (!conta.data_nascimento) {
        return 'O campo "data_nascimento" é obrigatório.';
    }

    if (!conta.telefone) {
        return 'O campo "telefone" é obrigatório.'
    }

    if (!conta.email) {
        return 'O campo "email" é obrigatório.';
    }

    if (!conta.senha) {
        return 'O campo "senha" é obrigatório.';
    }
}

function validarDadosParaAtualizarUsuario(dados) {
    if (Object.keys(dados).length === 0) {
        return 'Digite a informação que deseja alterar.'
    }

    for (let item of contas) {
        if (item.usuario.cpf === dados.cpf) {
            return 'Este CPF já possui conta em nosso banco.';
        }
    }

    for (let item of contas) {
        if (item.usuario.email === dados.email) {
            return 'Este e-mail já está vinculado a outra conta.';
        }
    }
}

function validarDadosParaExcluirConta(id, conta) {
    const saldo = conta.saldo;

    if (saldo !== 0) {
        return 'A conta ' + id + ' não pode ser excluida, pois ainda possui saldo.';
    }
}

function validarDadosParaDepositar(dados) {
    if (!dados.numero) {
        return 'O campo "numero" da conta é obrigatório.'
    }

    if (!dados.valor) {
        return 'O campo "valor" a ser depositado é obrigatório.';
    }

    if (Number(dados.valor) <= 0) {
        return 'O "valor" a ser depositado tem que ser maior que 0(zero).';
    }
}

function validarDadosParaSacar1(dados) {
    if (!dados.numero) {
        return 'O campo "numero" da conta é obrigatório.'
    }

    if (!dados.valor) {
        return 'O campo "valor" a ser depositado é obrigatório.';
    }

    if (!dados.senha) {
        return 'O campo "senha" é obrigatório.';
    }
}

function validarDadosParaSacar2(dados, conta) {
    if (dados.senha !== conta.usuario.senha) {
        return 'Senha incorreta';
    }

    if (dados.valor > conta.saldo) {
        return 'Saldo insuficiente para saque';
    }
}

function validarDadosParaTranferir1(dados) {
    if (!dados.numero_origem) {
        return 'O campo "numero_origem" da conta é obrigatório.'
    }

    if (!dados.valor) {
        return 'O campo "valor" a ser depositado é obrigatório.';
    }

    if (!dados.senha) {
        return 'O campo "senha" é obrigatório.';
    }

    if (!dados.numero_destino) {
        return 'O campo "numero_destino" da conta é obrigatório.'
    }
}

function validarDadosParaTranferir2(dados, conta) {
    if (dados.senha !== conta.usuario.senha) {
        return 'Senha incorreta';
    }

    if (dados.valor > conta.saldo) {
        return 'Saldo insuficiente';
    }
}

module.exports = {
    validarDadosParaAbrirConta,
    validarDadosParaAtualizarUsuario,
    validarDadosParaExcluirConta,
    validarDadosParaDepositar,
    validarDadosParaSacar1,
    validarDadosParaSacar2,
    validarDadosParaTranferir1,
    validarDadosParaTranferir2
}