const API_BASE_URL = 'http://localhost:8081';

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idInterprete = urlParams.get('id');

    if (!idInterprete) {
        alert("Intérprete não selecionado.");
        window.location.href = "index.html"; // Ajuste para o nome da sua página principal
        return;
    }

    carregarPerfil(idInterprete);
});

async function carregarPerfil(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/interpretes/${id}`);
        
        if (!response.ok) {
            throw new Error("Erro ao buscar intérprete");
        }

        const interprete = await response.json();

        // Preenche os dados na tela
        document.getElementById("perfil-nome").innerText = interprete.nome;
        document.getElementById("perfil-foto").src = interprete.foto || "img/placeholder.png";
        document.getElementById("perfil-descricao").innerText = interprete.descricao || "Sem descrição disponível.";
        
        // Localização (Bairro vazio por enquanto)
        document.getElementById("perfil-estado-cidade").innerText = `${interprete.estado || ''} - ${interprete.cidade || ''}`;
        document.getElementById("perfil-bairro").innerText = ""; 
        
        // Preço
        document.getElementById("perfil-preco").innerText = `R$ ${interprete.valorHora},00`;

        // Especialidades (Chips)
        const chipsContainer = document.getElementById("perfil-especialidades");
        chipsContainer.innerHTML = ""; 
        
        if (interprete.especialidades && interprete.especialidades.length > 0) {
            interprete.especialidades.forEach(esp => {
                const chip = document.createElement("span");
                chip.className = "chip";
                chip.innerText = esp;
                chipsContainer.appendChild(chip);
            });
        }

            // Botão de Whatsapp
            const btnWhats = document.getElementById("btn-whatsapp");
            btnWhats.onclick = () => {
                if (interprete.telefone) {
                    // Limpa o telefone (remove parênteses, traços e espaços)
                    let numeroLimpo = interprete.telefone.replace(/\D/g, '');
                    
                    // Adiciona o 55 (Brasil) se não tiver
                    if (!numeroLimpo.startsWith('55')) {
                        numeroLimpo = '55' + numeroLimpo;
                    }

                    // Mensagem engatilhada
                    const mensagem = `Olá, ${interprete.nome}! Eu vi o seu perfil no LinkLibras e gostaria de solicitar um serviço com você.`;
                    
                    // Codifica a mensagem para ir na URL
                    const mensagemCodificada = encodeURIComponent(mensagem);
                    
                    // Abre o WhatsApp em nova aba
                    window.open(`https://wa.me/${numeroLimpo}?text=${mensagemCodificada}`, '_blank');
                } else {
                    alert("Este intérprete ainda não cadastrou um telefone para contato.");
                }
            };

    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar os dados do intérprete.");
    }
}