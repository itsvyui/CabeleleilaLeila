console.log("Login.js");
// elementos que serão interagidos
let iptUsuario = document.getElementById("ipt-usuario");
let iptSenha = document.getElementById("ipt-senha")
let btnEntrar = document.getElementById("btn-entrar");
let btnCadastrar = document.getElementById("btn-cadastrar");

// adicionar a função de login ao botão Entrar
btnEntrar.addEventListener("click", () => {
    ok = verificarCampos(); // verificar se os campos foram corretamente preenchidos
    if (ok) {
        axios.post("/entrar", { // requisição POST, passando os valores de nome de usuário e senha ao servidor
            usuario: iptUsuario.value,
            senha: iptSenha.value
        }).then((res) => {
            console.log(res.data);
            limparCampos();
            if (res.status == 200) { // caso a resposta do servidor seja positiva, o usuário realiza o login e é redirecionado para a página de agendamento de serviços
                window.location = "/agendamento"
            }
        }).catch((erro) => {
            console.log(erro);
        })
    }
})

btnCadastrar.addEventListener("click", () => {
    window.location = "/cadastro"; // redireciona para a página de cadastrar novo usuário
})

function verificarCampos() { // função para verificar se os campos estão vazios
    if (iptUsuario.value === "" || iptSenha.value === "") {
        alert("Por favor preencha todos os campos.");
        return false;
    }
    return true;
}

function limparCampos() { // limpar os campos de input.
    iptUsuario.value = "";
    iptSenha.value = "";
}