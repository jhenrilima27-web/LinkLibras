// =====================================================
// CONFIG
// =====================================================
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8081'
    : 'https://sua-api-no-render.onrender.com';

const filtros = {
    cidade: null,
    nome: null,
    especialidades: new Set(),
    precoMax: null
};

// =====================================================
// SLIDER DE PREÇO
// =====================================================
function atualizarPreco(bolaSelecionada, index, dispararBusca = true) {
    const preco = document.getElementById("valorPreco");
    const bolas = document.querySelectorAll(".bola");

    const valor = Number(bolaSelecionada.dataset.valor);

    preco.innerText = "R$ " + valor;

    const posicao = bolaSelecionada.offsetLeft + (bolaSelecionada.offsetWidth / 2);
    preco.style.left = posicao + "px";

    bolas.forEach((b, i) => {
        b.classList.toggle("ativa", i <= index);
    });

    filtros.precoMax = valor;

    if (dispararBusca) {
        carregarInterpretes();
    }
}

function initPrecoSlider() {
    const bolas = document.querySelectorAll(".bola");
    const preco = document.getElementById("valorPreco");

    if (bolas.length === 0) return;

    bolas.forEach((bola, index) => {
        bola.addEventListener("click", () => {
            atualizarPreco(bola, index, true);
        });
    });

    // Apenas formatação visual da primeira bolinha, SEM alterar filtros.precoMax
    const primeira = bolas[0];
    preco.innerText = "R$ " + primeira.dataset.valor;
    
    const posicao = primeira.offsetLeft + (primeira.offsetWidth / 2);
    preco.style.left = posicao + "px";
    
    bolas.forEach((b, i) => {
        b.classList.toggle("ativa", i === 0);
    });
}

// =====================================================
// FILTROS DE ESPECIALIDADE
// =====================================================
function initFiltros() {
    const botoesFiltro = document.querySelectorAll(".filtros button");

    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", () => {
            const nome = botao.textContent.trim();

            if (filtros.especialidades.has(nome)) {
                filtros.especialidades.delete(nome);
                botao.classList.remove("ativo");
            } else {
                filtros.especialidades.add(nome);
                botao.classList.add("ativo");
            }

            carregarInterpretes();
        });
    });
}

// =====================================================
// CIDADE (Enter)
// =====================================================
function initCidade() {
    const input = document.getElementById("inputCidade");
    if (!input) return;

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();

            const valor = input.value.trim();
            filtros.cidade = valor === "" ? null : valor;

            carregarInterpretes();
        }
    });
}

// =====================================================
// BUSCA POR NOME (Enter na barra do header)
// =====================================================
function initBuscaNome() {
    const input = document.getElementById("inputBuscaNome");
    if (!input) return;

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();

            const valor = input.value.trim();
            filtros.nome = valor === "" ? null : valor;

            carregarInterpretes();
        }
    });
}

// =====================================================
// BUSCA + RENDER
// =====================================================
async function carregarInterpretes() {
    try {
        const params = new URLSearchParams();

        if (filtros.cidade) {
            params.append("cidade", filtros.cidade);
        }
        if (filtros.nome) {
            params.append("nome", filtros.nome);
        }
        if (filtros.especialidades.size > 0) {
            params.append("especialidades", Array.from(filtros.especialidades).join(","));
        }
        if (filtros.precoMax !== null) {
            params.append("precoMax", filtros.precoMax);
        }

        const semFiltros =
            !filtros.cidade &&
            !filtros.nome &&
            filtros.especialidades.size === 0 &&
            filtros.precoMax === null;

        const url = semFiltros
            ? `${API_BASE_URL}/api/interpretes/destaques`
            : `${API_BASE_URL}/api/interpretes?${params.toString()}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const interpretes = await response.json();
        renderizarCards(interpretes);

    } catch (error) {
        console.error("Erro ao carregar os intérpretes:", error);
        document.querySelector(".cards").innerHTML =
            "<p>Não foi possível carregar os intérpretes.</p>";
    }
}

function renderizarCards(interpretes) {
    const cardsContainer = document.querySelector(".cards");
    cardsContainer.innerHTML = "";

    if (!interpretes || interpretes.length === 0) {
        cardsContainer.innerHTML =
            "<p>Nenhum intérprete encontrado com esses filtros.</p>";
        return;
    }

    const notaFixa = 4.5;

    interpretes.forEach(interprete => {
        const card = document.createElement("div");
        card.className = "card";

        const nome = interprete.nome || "Sem nome";
        const primeiroNome = nome.split(" ")[0];

        const especialidades = Array.isArray(interprete.especialidades)
            ? interprete.especialidades
            : [];

        card.innerHTML = `
            <a href="perfil.html?id=${interprete.id}" style="text-decoration: none; color: inherit;">
                <div class="imagem">
                    <img src="${interprete.foto || 'imagens/pessoa1.png'}" alt="${nome}">
                    <div class="nome-pessoa">${primeiroNome}</div>
                </div>
                <div class="dados">
                    <div class="localizacao-nota">
                        <div class="localizacao">
                            <img src="imagens-thiago/pin.png" alt="">
                            <div class="localizacao-h1">
                                <div class="pessoa-cidade">${interprete.estado || ''}</div>
                                <div class="bairro">${interprete.cidade || ''}</div>
                            </div>
                        </div>
                        <div class="nota-container">
                            <img src="imagens-thiago/estrela.png" alt="">
                            <div class="nota">${notaFixa}</div>
                        </div>
                    </div>
                    <div class="habilidades">
                        ${especialidades.map(hab => `<div class="hab-1">${hab}</div>`).join("")}
                    </div>
                    <div class="descricao-pessoa">
                        ${interprete.descricao || ""}
                    </div>
                    <div class="preco-pessoa">
                        R$${interprete.valorHora ?? 0}/h
                    </div>
                </div>
            </a>
        `;

        cardsContainer.appendChild(card);
    });
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================
document.addEventListener("DOMContentLoaded", function () {
    initCidade();
    initBuscaNome();
    initFiltros();
    initPrecoSlider();
    carregarInterpretes();
});