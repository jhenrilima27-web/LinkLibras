
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
    if (dadosAnteriores[campo]) {
        document.getElementById(campo).value = dadosAnteriores[campo];
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

// Botão para voltar à página 2
function voltarPagina() {
    window.location.href = "Pagina_cadastro_interprete2.html";
}

// Evento de finalização do formulário
formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    // Recupera os dados preenchidos na página 3
    const dadosFormulario = new FormData(formulario);

    const dadosProfissionais = {};

    // Separa os campos de texto do arquivo
    dadosFormulario.forEach(function(valor, chave) {
        if (chave !== "foto" && chave !== "senha") {
            dadosProfissionais[chave] = valor;
        }
    });

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

    // Junta os dados das três páginas
    const dadosCompletos = {
        ...dadosAnteriores,
        ...dadosProfissionais
    };

    // Salva os dados de texto, sem armazenar a senha
    sessionStorage.setItem(
        "dadosCadastroInterprete",
        JSON.stringify(dadosCompletos)
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

    // Por enquanto, apenas prepara os dados para a integração
    console.log("Dados do cadastro preparados para envio.");
    console.log("Campos preparados:", [...envio.keys()]);

    alert("Os dados foram reunidos! Agora podemos preparar a integração com o servidor.");

});
