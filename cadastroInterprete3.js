
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

// Carrega as especialidades disponíveis no banco de dados
async function carregarEspecialidades() {

    const container = document.getElementById("containerEspecialidades");

    // Categorias disponíveis no backend
    const categorias = [
        { nome: "Modalidade", endpoint: "modalidade" },
        { nome: "Área de atuação", endpoint: "area_atuacao" },
        { nome: "Recursos", endpoint: "recurso" },
        { nome: "Disponibilidade", endpoint: "disponibilidade" },
        { nome: "Idiomas", endpoint: "idioma" }
    ];


 // Recupera as especialidades já selecionadas anteriormente
    const selecionadas = Array.isArray(dadosAnteriores.especialidades)
        ? dadosAnteriores.especialidades.map(Number)
        : [];

    container.innerHTML = "";

    try {

        for (const categoria of categorias) {

            const resposta = await fetch(
                `http://localhost:8081/api/especialidades/categoria/${categoria.endpoint}`
            );
            if (!resposta.ok) {
                throw new Error("Não foi possível carregar as especialidades.");
            }

            const especialidades = await resposta.json();


            // Cria um bloco para cada categoria
            const bloco = document.createElement("div");
            bloco.classList.add("bloco-categoria");

            // Cria o título da categoria
            const titulo = document.createElement("h3");
            titulo.textContent = categoria.nome;

            bloco.appendChild(titulo);

            // Cria as opções da categoria
            const grupo = document.createElement("div");
            grupo.classList.add("grupo-especialidades");

            especialidades.forEach(function(especialidade) {

                const label = document.createElement("label");
                const checkbox = document.createElement("input");

                checkbox.type = "checkbox";
                checkbox.name = "especialidades";
                checkbox.value = especialidade.idEspecialidade;

                 // Mantém marcada uma opção selecionada anteriormente
                checkbox.checked = selecionadas.includes(
                    Number(especialidade.idEspecialidade)
                );

                label.appendChild(checkbox);
                label.appendChild(
                    document.createTextNode(" " + especialidade.nome)
                );

                grupo.appendChild(label);
            });

            bloco.appendChild(grupo);

            container.appendChild(bloco);
        }

    } catch (erro) {

        console.error("Erro ao carregar especialidades:", erro);

        container.innerHTML =
            "<p>Não foi possível carregar as especialidades. Tente novamente.</p>";
    }
}


// Executa o carregamento
carregarEspecialidades();


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
