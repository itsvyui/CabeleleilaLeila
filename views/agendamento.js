console.log("Agendamento.js")
// variável auxiliar para controlar qual agendamento está sendo alterado
let idAgendamentoEdit;
// elementos que serão utilizados
tituloAgendamento = document.getElementById("titulo-agendamento");
tituloEditar = document.getElementById("titulo-editar");

iptData = document.getElementById("ipt-data");
iptHora = document.getElementById("ipt-hora");
iptTelefone = document.getElementById("ipt-telefone");
iptDescricao = document.getElementById("ipt-descricao");

btnAgendar = document.getElementById("btn-agendar");
btnEditar = document.getElementById("btn-editar");
btnCancelar = document.getElementById("btn-cancelar");
btnSair = document.getElementById("btn-sair");


btnAgendar.addEventListener("click", () => { // adicionando a função de cadastrar um novo agendamento ao botão Agendar
    const ok = verificarCampos(); // verifica se os campos foram preenchidos de forma correta

    if (ok) {
        axios.post('/agendar', { // requisição POST, com as informações necessárias para cadastrar um novo agendamento
            data: iptData.value,
            hora: iptHora.value,
            telefone: iptTelefone.value,
            descricao: iptDescricao.value,
            idUsuario: id
        }).then((res) => {
            console.log(res);
            limparCampos();
            window.location = "/agendamento"; // se não tiver nenhum erro, a página é recarregada
        }).catch((erro) => {
            console.log(erro);
        })
    }
})

btnEditar.addEventListener("click", () => { // adiciona a função de salvar alterações ao botão Editar
    const ok = verificarCampos(); // verifica se os campos continuam corretamente preenchidos

    if (ok) {
        axios.post("/alterarAgendamento", { // requisição POST, com os novos valores e o id do agendamento que será alterado
            data: iptData.value,
            hora: iptHora.value,
            telefone: iptTelefone.value,
            descricao: iptDescricao.value,
            idAgendamento: idAgendamentoEdit
        }).then((res) => {
            console.log(res)
            window.location = "/agendamento" // caso não tenha nenhum erro, a página é recarregada
        }).catch((erro) => {
            console.log(erro)
        })
    }
})

btnCancelar.addEventListener("click", () => { // adiciona a função de cancelar um agendamento ao botão Cancelar
    const ok = confirm("Tem certeza que deseja cancelar o agendamento?") // confirma se o usuário realmente deseja cancelar o agendamento

    if (ok) {
        axios.post("/cancelarAgendamento", { // requisição POST com o id do agendamento a ser cancelado
            idAgendamento: idAgendamentoEdit
        }).then((res) => {
            console.log(res)
            window.location = "/agendamento" // caso tenha nenhum erro, a página é recarregada.
        }).catch((erro) => {
            console.log(erro)
        })
    }
})

btnSair.addEventListener("click", () => { // adiciona a função de sair ao botão de Saída
    axios.get("/logout")
        .then((res) => {
            console.log(res)
            window.location = "/" // redireciona para a página inicial
        })
        .catch((erro) => {
            console.log(erro);
        })
})

function selecionarAgendamento(id, data) {// função disponível para cada agendamento no histórico de agendamentos, para selecionar o agendamento que o usuário deseja alterar
    id = Number(id)

    const ok = verificarDataParaAlteracao(data) // verifica se a tentativa de alteração é feita com pelo menos 2 dias de antecedência
    if (ok) { // se sim...
        axios.get("/infoAgendamento", { params: { idAgendamento: id } }) // é feita uma requisição GET para obter todas as informações do agendamento selecionado
            .then((res) => {
                console.log(res);
                let agendamento = res.data.msg[0];
                console.log(agendamento)
                esconderAgendamento();
                // Altera o valor dos campos de input para o usuário realizar as alterações desejadas.
                iptData.value = agendamento.data;
                iptHora.value = agendamento.hora;
                iptTelefone.value = agendamento.telefone;
                iptDescricao.value = agendamento.descricao;
                idAgendamentoEdit = id;
            })
            .catch((erro) => {
                console.log(erro);
            })
    }
}

function verificarDataParaAlteracao(dataAgendada) { // verifica se a tentativa de alteração está dentro do prazo de 2 dias, ou se o agendamento já foi concluido
    let [ano, mes, dia] = dataAgendada.split('-')
    dataAgendada = new Date(ano, mes - 1, dia);
    let hoje = new Date();
    if (hoje.getDate() > dataAgendada.getDate()) {
        alert("A data do agendamento já passou. Não é mais possível fazer uma alteração.")
        return false;
    } else if (dataAgendada.getDate() - hoje.getDate() < 2) {
        alert("Com menos de 2 dias de antecedência, as alterações devem ser feitas pelos contatos encontrados no fim da página.")
        return false;
    } else {
        return true;
    }
}

function verificarCampos() { // verifica se os campos foram corretamente preeechidos
    if (!iptData.value || !iptHora.value || !iptTelefone.value || !iptDescricao.value) { // verifica se os campos não estão vazios
        alert("Por favor preencha todos os campos.");
        return false;
    }
    let [ano, mes, dia] = iptData.value.split('-')
    let dataAgendamento = new Date(ano, mes - 1, dia);
    let hoje = new Date();
    if (hoje.getDate() > dataAgendamento.getDate()) { // verifica se a data informada não é uma data passada
        alert("A data de agendamento informada é muito antiga.");
        return false;
    }
    return true;
}

function limparCampos() { // limpar os campos de input
    iptData.value = "";
    iptHora.value = "";
    iptTelefone.value = "";
    iptDescricao.value = "";
}

function esconderAgendamento(teste) { // altera do modo de adicionar novo agendamento para o modo de alterar o agendamento selecionado
    console.log(teste);

    tituloAgendamento.classList.add("hidden");
    btnAgendar.classList.add("hidden");

    tituloEditar.classList.remove("hidden");
    btnEditar.classList.remove("hidden");
    btnCancelar.classList.remove("hidden");
}

function mostrarAgendamento() { // altera do modo de alterar agendamento para o modo de adicionar novo agendamento.
    tituloAgendamento.classList.remove("hidden");
    btnAgendar.classList.remove("hidden");

    tituloEditar.classList.add("hidden");
    btnEditar.classList.add("hidden");
    btnCancelar.classList.add("hidden");
}