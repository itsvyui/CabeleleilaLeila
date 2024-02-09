import * as sqlite3 from "sqlite3";

export function conectar() {// criar a conexão com o banco de dados
    return new sqlite3.default.Database('./cabeleleila.db', sqlite3.OPEN_READWRITE, (erro) => {
        console.error(erro);
    });
}

export function criarTabelas() { // criar as tabelas de usuários e agendamentos
    const banco = conectar();

    let sql = `CREATE TABLE IF NOT EXISTS usuarios(
        id_usuario INTEGER PRIMARY KEY, 
        usuario TEXT NOT NULL, 
        senha TEXT NOT NULL, 
        nome TEXT NOT NULL)`;
    banco.run(sql);

    sql = `CREATE TABLE IF NOT EXISTS agendamentos(
        id_agendamento INTEGER PRIMARY KEY, 
        id_usuario INTEGER NOT NULL, 
        data TEXT NOT NULL, 
        hora TEXT NOT NULL, 
        descricao TEXT NOT NULL, 
        telefone TEXT NOT NULL, 
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario))`
    banco.run(sql);

    banco.close();
}

export async function addUsuario(usuario, senha, nome) {
    const ok = await verificarUsuario(usuario); // confirma se o nome de usuário está disponível

    return new Promise((resolve, reject) => { // como sqlite3 não tem suporte à async e await por padrão, é necessário utilizar Promise
        const banco = conectar();

        if (ok) { // caso já exista um usuário com o nome de usuário passado
            return resolve(false); // retornar que a adição não foi feita com sucesso
        } else { // caso o nome de usuário esteja disponível, é feita uma query de INSERT, com os valores passados
            let sql = `INSERT INTO usuarios (usuario, senha, nome) VALUES (?,?,?)`;
            banco.run(sql, [usuario, senha, nome]);
            return resolve(true);
        }
    })
}

export async function verificarLogin(usuario, senha) { // função responsável por verificar o login
    const usuarioBD = await verificarUsuario(usuario); // primeiro, observa-se se o nome de usuário está presente no banco de dados

    if (usuarioBD) { // compara os valores armazenados no banco de dados com os dados passados
        if (usuarioBD[0].usuario == usuario && usuarioBD[0].senha == senha) return true // se os valores baterem, o usuário pode concluir o login
        else return false // caso contrário, o login não é feito
    } else {
        return false
    }
}

function verificarUsuario(usuario) { // função para verificar a existência de um usuário no banco de dados com o nome de usuário passado
    return new Promise((resolve, reject) => {
        const banco = conectar();

        let sql = `SELECT * FROM usuarios WHERE usuario = ?`

        banco.all(sql, [usuario], (erro, rows) => {
            if (erro) {
                console.error(erro);
                reject(erro);
            } else {
                if (rows.length > 0) return resolve(rows); // caso a query retorne um resultado (array não vazio), o nome de usuário já existe, e o usuário encontrado é retornado como resposta
                else return resolve(false);
            }
        })
    })

}

export function verTodosUsuarios() { // função utilizada para testes, observando os usuários cadastrados no banco de dados
    console.log("verTodosUsuarios")
    return new Promise((resolve, reject) => {
        const banco = conectar();

        let sql = `SELECT * FROM usuarios`

        banco.all(sql, [], (erro, rows) => {
            if (erro) {
                console.error(erro);
                resolve(erro);
            } else {
                resolve(rows);
            }
        })
    })
}

export async function obterIdUsuario(usuario) { // função para obter o id, dado um nome de usuário
    const usuarioBD = await verificarUsuario(usuario);

    if (usuarioBD) {
        return usuarioBD[0].id_usuario;
    } else {
        return false;
    }
}

export function addAgendamento(data, hora, telefone, descricao, id) {// função para adicionar um novo agendamento
    return new Promise((resolve, reject) => {
        const banco = conectar();

        let sql = `INSERT INTO agendamentos (data, hora, telefone, descricao, id_usuario) VALUES (?,?,?,?,?)`;
        banco.run(sql, [data, hora, telefone, descricao, id]);
        return resolve({ msg: "Agendamento adicionado com sucesso." });
    })
}

export function obterAgendamentosUsuario(id) { // essa função retorna uma array com os agendamentos feitos por um usuário, cujo o id foi passado
    return new Promise((resolve, reject) => {
        const banco = conectar();

        let sql = `SELECT a.data, a.hora, a.telefone, a.descricao, a.id_agendamento FROM usuarios AS u INNER JOIN agendamentos AS a ON u.id_usuario = a.id_usuario WHERE a.id_usuario = ? ORDER BY date(a.data) DESC`
        banco.all(sql, [id], (erro, rows) => {
            if (erro) {
                console.error(erro);
                resolve(erro);
            } else {
                resolve(rows);
            }
        })
    })
}

export function obterAgendamentoPorId(id) { // essa função retorna o agendamento, por meio do id do agendamento passado.
    return new Promise((resolve, reject) => {
        const banco = conectar();

        let sql = `SELECT * FROM agendamentos WHERE id_agendamento=?`
        banco.all(sql, [id], (erro, rows) => {
            if (erro) {
                console.error(erro);
                resolve(erro);
            } else {
                resolve(rows);
            }
        })
    })
}

export function verTodosAgendamentos() { // função para teste, para observar os agendamentos cadastrados no banco de dados
    console.log("verTodosAgendamentos");

    return new Promise((resolve, reject) => {
        const banco = conectar();
        let sql = `SELECT * FROM agendamentos ORDER BY date(data) DESC`
        banco.all(sql, [], (erro, rows) => {
            if (erro) {
                console.error(erro);
                resolve(erro);
            } else {
                console.log(rows);
                resolve(rows);
            }
        })
    })
}

export function alterarAgendamento(data, hora, telefone, descricao, id) { // função para alterar os valores do agendamento, dado o id desse agendamento, e os novos valores passados
    return new Promise((resolve, reject) => {
        const banco = conectar();

        let sql = `UPDATE agendamentos SET data=?, hora=?, telefone=?, descricao=? WHERE id_agendamento=?`
        banco.run(sql, [data, hora, telefone, descricao, id], (erro) => {
            console.error(erro);
        });
        return resolve({ msg: "Agendamento alterado com sucesso." })
    })
}

export function cancelarAgendamento(id) { // função para deletar um agendamento, dado um id passado.
    return new Promise((resolve, reject) => {
        const banco = conectar();

        let sql = `DELETE FROM agendamentos WHERE id_agendamento=?`
        banco.run(sql, [id], (erro) => {
            console.error(erro);
        });
        return resolve({ msg: "Agendamento deletado com sucesso." })
    })
}


