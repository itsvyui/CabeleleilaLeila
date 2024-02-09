import express from "express";
import * as bd from "./bd.js";

// set-up do servidor
const app = express();
app.use(express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = 3000;
let usuarioAtivo;
// criando as tabelas do banco de dados
bd.criarTabelas();
console.log(bd.verTodosUsuarios());

// ----- Requisições GET -----
app.get("/", (req, res) => {
    return res.render("index.ejs"); // começa renderizando a página inicial/ página de login
});

app.get("/logout", (req, res) => {
    usuarioAtivo = "";
    return res.send({ msg: "Usuario deslogado com sucesso." });
})

app.get("/cadastro", (req, res) => {
    return res.render("cadastro.ejs");
})

app.get("/agendamento", async (req, res) => { // retornar a lista de agendamentos feitos pelo usuário logado
    const agendamentos = await bd.obterAgendamentosUsuario(usuarioAtivo);
    res.render("agendamento.ejs", {
        idUsuario: usuarioAtivo,
        agendamentos: agendamentos
    });
})

app.get("/infoAgendamento", async (req, res) => { // retorna o agendamento que o usuário deseja editar
    console.log("get infoAgendamento");
    console.log(req.query);
    const agendamento = await bd.obterAgendamentoPorId(req.query.idAgendamento);
    return res.status(200).send({ msg: agendamento });
})

// ----- Requisições POST -----
app.post("/entrar", async (req, res) => {
    const ok = await bd.verificarLogin(req.body.usuario, req.body.senha); // verifica se o login informado está presente no banco de dados
    if (ok) { // se sim, o usuário consegue logar na sua conta
        usuarioAtivo = await bd.obterIdUsuario(req.body.usuario);
        res.status(200).send({ msg: "Login realizado com sucesso." })
    } else { // caso contrário, o acesso não é permitido
        res.status(400).send({ msg: "Usuário ou Senha incorretos." })
    }

})

app.post("/cadastrar", async (req, res) => {
    const ok = await bd.addUsuario(req.body.usuario, req.body.senha, req.body.nome); // verifica se o nome de usuário está disponível
    if (ok) { // se sim, o novo usuário é cadastrado
        return res.status(201).send({msg: "Usuário cadastrado com sucesso."});
    } else { // caso contrário, o usuário terá de informar um outro nome de usuário
        return res.status(200).send({msg: "O nome de usuário não está disponível"});
    }   
})

app.post("/agendar", async (req, res) => {// faz o agendamento do serviço com as informações fornecidas
    const ok = await bd.addAgendamento(req.body.data, req.body.hora, req.body.telefone, req.body.descricao, req.body.idUsuario);
    return res.status(200).send({ msg: "Agendamento feito com sucesso" });
})

app.post("/alterarAgendamento", async (req, res) => { // faz a alteração do agendamento conforme as informações fornecidas
    const ok = await bd.alterarAgendamento(req.body.data, req.body.hora, req.body.telefone, req.body.descricao, req.body.idAgendamento);
    return res.status(200).send({ msg: "Agendamento alterado com sucesso." })
})

app.post("/cancelarAgendamento", async (req, res) => { // faz o cancelamento do agendamento selecionado pelo usuário
    const ok = await bd.cancelarAgendamento(req.body.idAgendamento)
    return res.status(200).send({ msg: "Agendamento cancelado com sucesso." })
})

app.listen(port, () => {
    console.log(`O servidor iniciou na porta ${port}`);
})