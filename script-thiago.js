// Função para atualizar o slider de preço
function atualizarPreco(bolaSelecionada, index) {
    const preco = document.getElementById("valorPreco");
    const bolas = document.querySelectorAll(".bola");
    
    preco.innerText = "R$ " + bolaSelecionada.dataset.valor;

    const posicao = bolaSelecionada.offsetLeft + (bolaSelecionada.offsetWidth / 2);
    preco.style.left = posicao + "px";

    bolas.forEach((b, i) => {
        if (i <= index) {
            b.classList.add("ativa");
        } else {
            b.classList.remove("ativa");
        }
    });
}

// Inicializar o slider de preço
function initPrecoSlider() {
    const bolas = document.querySelectorAll(".bola");
    
    if (bolas.length > 0) {
        bolas.forEach((bola, index) => {
            bola.addEventListener("click", () => {
                atualizarPreco(bola, index);
            });
        });
        
        atualizarPreco(bolas[0], 0);
    }
}

// Função para inicializar os filtros
function initFiltros() {
    const botoesFiltro = document.querySelectorAll(".filtros button");
    
    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", () => {
            botao.classList.toggle("ativo");
        });
    });
}

// Inicializar tudo quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function() {
    carregarInterpretes();
    initPrecoSlider();
    initFiltros();
});


// Função para carregar e exibir os cards dos intérpretes
async function carregarInterpretes() {
    try {
        // Carregar o arquivo JSON
        const response = await fetch('api_interpretes-thiago.php');
        const data = await response.json();
        const interpretes = data.interpretes;
        
        // Selecionar o container dos cards
        const cardsContainer = document.querySelector('.cards');
        
        // Limpar os cards existentes (manter apenas o primeiro como template? Vamos limpar tudo)
        cardsContainer.innerHTML = '';
        
        // Arrays com habilidades e notas fixas para todos
        const habilidadesFixas = ["Eventos", "Presencial", "Inglês"];
        const notaFixa = 4.5;
        
        // Para cada intérprete no JSON, criar um card
        interpretes.forEach(interprete => {
            // Criar a estrutura do card
            const card = document.createElement('div');
            card.className = 'card';
            
            // Montar o HTML do card
            card.innerHTML = `
            <a href="perfil.html" style="text-decoration: none; color: inherit;">
                    <div class="imagem">
                        <img src="${interprete.foto || 'imagens/pessoa1.png'}" alt="${interprete.nomeCompleto}">
                        <div class="nome-pessoa">${interprete.nomeCompleto.split(' ')[0]}</div>
                    </div>      
                    <div class="dados">
                        <div class="localizacao-nota">
                            <div class="localizacao">
                                <img src="imagens/pin.png" alt="">
                                <div class="localizacao-h1">
                                    <div class="pessoa-cidade">${interprete.estado}</div>
                                    <div class="bairro">${interprete.cidade}</div>
                                </div>    
                            </div>
                            <div class="nota-container">
                                <img src="imagens/estrela.png" alt="">
                                <div class="nota">${notaFixa}</div>
                            </div>  
                        </div>
                        <div class="habilidades">
                            ${habilidadesFixas.map(hab => `<div class="hab-1">${hab}</div>`).join('')}
                        </div>
                        <div class="descricao-pessoa">
                            ${interprete.descricao}
                        </div>
                        <div class="preco-pessoa">
                            R$${interprete.precoHora}/h
                        </div>
                    </div>
                </a>    
            `;
            
            // Adicionar o card ao container
            cardsContainer.appendChild(card);
        });
        
    } catch (error) {
        console.error('Erro ao carregar os intérpretes:', error);
        console.log('Verifique se o arquivo interpretes.json está na mesma pasta do seu HTML');
    }
}