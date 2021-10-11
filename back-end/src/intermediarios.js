const { banco, contas } = require('../src/dados/bancodedados');

function validarSenha(req, res, next) {
    const conta = contas.find(conta => conta.numero === Number(req.query.numero_conta));

    if (req.method !== 'GET') {
        next();
    } else if (req.query.senha_banco === banco.senha) {
        next();
    } else if (req.url === "/contas") {
        res.status(400);
        res.json({ "mensagem": "Informe a sua senha" });
    } else if (req.url === "/contas/saldo" || req.url === "/contas/extrato") {
        res.status(400);
        res.json({ "mensagem": "Informe o número da conta e/ou a senha" });
    } else if (!conta) {
        res.status(404);
        res.json({ "mensagem": `A conta ${req.query.numero_conta} não existe.` });
    } else if (req.query.senha === conta.usuario.senha) {
        next();
    } else {
        res.status(400);
        res.json({ erro: 'Senha incorreta' });
    }
}

module.exports = {
    validarSenha
}