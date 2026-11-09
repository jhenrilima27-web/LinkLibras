
const formulario = document.getElementById("formInterprete3");

// Recupera os dados das páginas anteriores
const dadosSalvos = sessionStorage.getItem("dadosCadastroInterprete");

// Verifica se o usuário passou pelas etapas anteriores
if (!dadosSalvos) {
    alert("É necessário preencher primeiro os dados pessoais e de endereço.");

    window.location.href = "Pagina_cadastro_interprete1.html";
}

// Recupera os dados já preenchidos
const dadosAnteriores = dadosSalvos ? JSON.parse(dadosSalvos) : {};

// Preenche os campos caso o usuário volte para esta página
["valorHora", "descricao", "especialidades"].forEach(function(campo) {

    const elemento = document.getElementById(campo);

    if (dadosAnteriores[campo] !== undefined) {
        elemento.value = dadosAnteriores[campo];
    }

});

// Mostra o nome da foto selecionada
document.getElementById("foto").addEventListener("change", function() {

    const arquivo = this.files[0];

    if (arquivo) {
        document.getElementById("nomeFoto").textContent =
            "Arquivo selecionado: " + arquivo.name;
    } else {
        document.getElementById("nomeFoto").textContent = "";
    }
});

// Função para salvar os dados profissionais
function salvarDadosProfissionais() {

    const dadosProfissionais = {

        valorHora: document.getElementById("valorHora").value,

        descricao: document.getElementById("descricao").value,

        especialidades: document.getElementById("especialidades").value

    };

// Junta os dados anteriores com os profissionais
    const dadosCompletos = {
        ...dadosAnteriores,
        ...dadosProfissionais
    };


// Atualiza o armazenamento temporário
    sessionStorage.setItem(
        "dadosCadastroInterprete",
        JSON.stringify(dadosCompletos)
    );

}

// Botão para voltar à página 2
function voltarPagina() {

    //Salva os dados antes de sair
    salvarDadosProfissionais();

    window.location.href = "Pagina_cadastro_interprete2.html";
}

// Evento de finalização do formulário
formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    // Recupera a foto selecionada
    const foto = document.getElementById("foto").files[0];

    // Verifica o tipo da imagem
    if (foto) {

        const formatosPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!formatosPermitidos.includes(foto.type)) {
            alert("Selecione uma imagem JPG, PNG ou WEBP.");
            return;
        }

         // Limite de 5 MB
        if (foto.size > 5 * 1024 * 1024) {
            alert("A imagem deve ter no máximo 5 MB.");
            return;
        }

    } 

    // Salva os dados profissionais
    salvarDadosProfissionais();



    // Recupera todos os dados atualizados
    const dadosCompletos = JSON.parse (
        sessionStorage.getItem("dadosCadastroInterprete")
    );
        


    // Prepara o envio dos dados utilizando FormData
    const envio = new FormData();

    Object.entries(dadosCompletos).forEach(function([chave, valor]) {
        envio.append(chave, valor);
    });

    // Acrescenta a senha, que não foi salva no sessionStorage
    envio.append("senha", document.getElementById("senha").value);

    // Acrescenta a foto, caso tenha sido selecionada
    if (foto) {
        envio.append("foto", foto);
    }

    // Exibe os dados preparados no console
    console.log("Dados do cadastro preparados para envio.");
    console.log("Campos preparados:", [...envio.keys()]);

    alert("Os dados foram reunidos! Agora podemos preparar a integração com o servidor.");

});
