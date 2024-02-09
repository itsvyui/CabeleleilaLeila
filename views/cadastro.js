console.log("Cadastro.js");

// elementos que serão utilizados
iptUsuario = document.getElementById("ipt-usuario")
iptSenha = document.getElementById("ipt-senha")
iptConfirma = document.getElementById("ipt-confirma")
iptNome = document.getElementById("ipt-nome")

btnEntrar = document.getElementById("btn-entrar")
btnCadastrar = document.getElementById("btn-cadastrar")


btnEntrar.addEventListener("click", () => {
    window.location = "/"; // redireciona para a página inicial/ página de login
})

btnCadastrar.addEventListener("click", () => {
    ok = verificarCampos(); // verifica se os campos foram corretamente preenchidos
    if (ok) {
        axios.post('/cadastrar', { // requisição POST, passando os valores necessários para cadastrar um novo usuário
            usuario: iptUsuario.value,
            senha: iptSenha.value,
            nome: iptNome.value
        }).then((res) => {
            console.log(res);
            if (res.status == 201) {
                limparCampos();
                window.location = "/" // caso o cadastro seja feito com sucesso, o usuário é redirecionado para a página de login
            } else {
                alert(res.data.msg); // caso contrário, é mostrado um aviso, para o usuário inserir um nome de usuário diferente.
            }
        }).catch((erro) => {
            console.log(erro)
        })
    }
})

function verificarCampos() {
    if (iptUsuario.value === "" || iptSenha.value === "" || iptConfirma.value === "" || iptNome.value === "") {// verifica se os campos estão preenchidos
        alert("Por favor preencha todos os campos.");
        return false;
    }

    if (iptSenha.value != iptConfirma.value) { // verifica se as duas senhas inseridas são iguais.
        alert("As duas senhas não são iguais.");
        return false;
    }

    return true;
}

function limparCampos() { // limpar campos de input.
    iptUsuario.value = "";
    iptSenha.value = "";
    iptConfirma.value = "";
    iptNome.value = "";
}