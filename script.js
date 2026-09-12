// ==========================================
// DADOS INICIAIS
// ==========================================

let chamados = JSON.parse(localStorage.getItem("helpdesk_chamados")) || [

    {
        id: 1,
        titulo: "Computador não liga",
        categoria: "Hardware",
        descricao: "O computador do setor financeiro não está ligando.",
        prioridade: "Alta",
        solicitante: "Carlos Silva",
        status: "Aberto",
        data: "12/09/2026"
    },

    {
        id: 2,
        titulo: "Erro no sistema interno",
        categoria: "Software",
        descricao: "O sistema apresenta uma mensagem de erro ao tentar acessar.",
        prioridade: "Média",
        solicitante: "Ana Souza",
        status: "Em andamento",
        data: "11/09/2026"
    },

    {
        id: 3,
        titulo: "Problema na internet",
        categoria: "Rede",
        descricao: "Computador não consegue acessar a internet.",
        prioridade: "Alta",
        solicitante: "Marcos Oliveira",
        status: "Resolvido",
        data: "10/09/2026"
    }

];


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    atualizarDashboard();
    renderizarChamados();
    renderizarRecentes();

});


// ==========================================
// SALVAR NO LOCALSTORAGE
// ==========================================

function salvarDados() {

    localStorage.setItem(
        "helpdesk_chamados",
        JSON.stringify(chamados)
    );

}


// ==========================================
// NAVEGAÇÃO
// ==========================================

function mostrarPagina(pagina, botao = null) {

    const paginas = document.querySelectorAll(".page");

    paginas.forEach(function (item) {
        item.classList.remove("active-page");
    });

    const paginaSelecionada = document.getElementById(pagina);

    if (paginaSelecionada) {
        paginaSelecionada.classList.add("active-page");
    }


    const botoes = document.querySelectorAll(".nav-item");

    botoes.forEach(function (item) {
        item.classList.remove("active");
    });


    if (botao) {

        botao.classList.add("active");

    } else {

        botoes.forEach(function (item) {

            if (
                item.getAttribute("onclick") &&
                item.getAttribute("onclick").includes(pagina)
            ) {
                item.classList.add("active");
            }

        });

    }


    const titulos = {

        "dashboard": [
            "Dashboard",
            "Visão geral dos chamados de suporte."
        ],

        "chamados": [
            "Chamados",
            "Gerencie os chamados do sistema."
        ],

        "novo-chamado": [
            "Novo chamado",
            "Registre um novo chamado de suporte."
        ]

    };


    if (titulos[pagina]) {

        document.getElementById("page-title").textContent =
            titulos[pagina][0];

        document.getElementById("page-subtitle").textContent =
            titulos[pagina][1];

    }

}


// ==========================================
// ABRIR NOVO CHAMADO
// ==========================================

function abrirNovoChamado() {

    limparFormulario();

    mostrarPagina("novo-chamado");

}


// ==========================================
// FORMULÁRIO
// ==========================================

document.getElementById("ticketForm").addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const editId =
            document.getElementById("editId").value;


        const titulo =
            document.getElementById("titulo").value.trim();

        const categoria =
            document.getElementById("categoria").value;

        const descricao =
            document.getElementById("descricao").value.trim();

        const prioridade =
            document.getElementById("prioridade").value;

        const solicitante =
            document.getElementById("solicitante").value.trim();


        // ======================================
        // EDITAR
        // ======================================

        if (editId) {

            const chamado =
                chamados.find(function (item) {
                    return item.id === Number(editId);
                });


            if (chamado) {

                chamado.titulo = titulo;
                chamado.categoria = categoria;
                chamado.descricao = descricao;
                chamado.prioridade = prioridade;
                chamado.solicitante = solicitante;

            }

            alert("Chamado atualizado com sucesso!");

        }


        // ======================================
        // CRIAR
        // ======================================

        else {

            const novoChamado = {

                id: Date.now(),

                titulo: titulo,

                categoria: categoria,

                descricao: descricao,

                prioridade: prioridade,

                solicitante: solicitante,

                status: "Aberto",

                data: new Date().toLocaleDateString("pt-BR")

            };


            chamados.unshift(novoChamado);

            alert("Chamado criado com sucesso!");

        }


        salvarDados();

        atualizarDashboard();

        renderizarChamados();

        renderizarRecentes();

        limparFormulario();

        mostrarPagina("chamados");

    }
);


// ==========================================
// LIMPAR FORMULÁRIO
// ==========================================

function limparFormulario() {

    document.getElementById("ticketForm").reset();

    document.getElementById("editId").value = "";

    document.getElementById("solicitante").value =
        "José Caldas";

    document.getElementById("form-title").textContent =
        "Criar novo chamado";

}


// ==========================================
// DASHBOARD
// ==========================================

function atualizarDashboard() {

    const total =
        chamados.length;

    const abertos =
        chamados.filter(function (item) {
            return item.status === "Aberto";
        }).length;

    const andamento =
        chamados.filter(function (item) {
            return item.status === "Em andamento";
        }).length;

    const resolvidos =
        chamados.filter(function (item) {
            return item.status === "Resolvido";
        }).length;


    document.getElementById("totalChamados").textContent =
        total;

    document.getElementById("chamadosAbertos").textContent =
        abertos;

    document.getElementById("chamadosAndamento").textContent =
        andamento;

    document.getElementById("chamadosResolvidos").textContent =
        resolvidos;

}


// ==========================================
// RENDERIZAR CHAMADOS
// ==========================================

function renderizarChamados() {

    const container =
        document.getElementById("all-tickets");

    const pesquisa =
        document.getElementById("searchInput").value.toLowerCase();

    const filtro =
        document.getElementById("statusFilter").value;


    const filtrados =
        chamados.filter(function (chamado) {

            const correspondePesquisa =
                chamado.titulo.toLowerCase().includes(pesquisa) ||
                chamado.descricao.toLowerCase().includes(pesquisa) ||
                chamado.categoria.toLowerCase().includes(pesquisa);

            const correspondeStatus =
                filtro === "Todos" ||
                chamado.status === filtro;

            return correspondePesquisa && correspondeStatus;

        });


    if (filtrados.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <p>Nenhum chamado encontrado.</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        filtrados.map(criarHTMLChamado).join("");

}


// ==========================================
// CHAMADOS RECENTES
// ==========================================

function renderizarRecentes() {

    const container =
        document.getElementById("recent-tickets");


    const recentes =
        chamados.slice(0, 5);


    if (recentes.length === 0) {

        container.innerHTML = `
            <p>Nenhum chamado registrado.</p>
        `;

        return;

    }


    container.innerHTML =
        recentes.map(criarHTMLChamado).join("");

}


// ==========================================
// HTML DO CHAMADO
// ==========================================

function criarHTMLChamado(chamado) {

    let statusClass = "";

    if (chamado.status === "Aberto") {

        statusClass = "status-aberto";

    } else if (chamado.status === "Em andamento") {

        statusClass = "status-andamento";

    } else {

        statusClass = "status-resolvido";

    }


    let prioridadeClass =
        "priority-" +
        chamado.prioridade
            .toLowerCase()
            .replace("é", "e");


    return `

        <div class="ticket">

            <div class="ticket-top">

                <div>

                    <div class="ticket-title">
                        #${chamado.id} — ${escaparHTML(chamado.titulo)}
                    </div>

                    <div class="ticket-description">
                        ${escaparHTML(chamado.descricao)}
                    </div>

                    <div class="ticket-info">

                        <span>
                            📁 ${escaparHTML(chamado.categoria)}
                        </span>

                        <span>
                            👤 ${escaparHTML(chamado.solicitante)}
                        </span>

                        <span>
                            📅 ${chamado.data}
                        </span>

                        <span class="${prioridadeClass}">
                            ● ${chamado.prioridade}
                        </span>

                    </div>

                </div>


                <span class="badge ${statusClass}">
                    ${chamado.status}
                </span>

            </div>


            <div class="ticket-actions">

                <button
                    class="action-btn"
                    onclick="visualizarChamado(${chamado.id})"
                >
                    👁 Visualizar
                </button>

                <button
                    class="action-btn"
                    onclick="editarChamado(${chamado.id})"
                >
                    ✏️ Editar
                </button>

                <button
                    class="action-btn"
                    onclick="alterarStatus(${chamado.id})"
                >
                    🔄 Status
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="excluirChamado(${chamado.id})"
                >
                    🗑 Excluir
                </button>

            </div>

        </div>

    `;

}


// ==========================================
// EDITAR CHAMADO
// ==========================================

function editarChamado(id) {

    const chamado =
        chamados.find(function (item) {
            return item.id === id;
        });


    if (!chamado) return;


    document.getElementById("editId").value =
        chamado.id;

    document.getElementById("titulo").value =
        chamado.titulo;

    document.getElementById("categoria").value =
        chamado.categoria;

    document.getElementById("descricao").value =
        chamado.descricao;

    document.getElementById("prioridade").value =
        chamado.prioridade;

    document.getElementById("solicitante").value =
        chamado.solicitante;

    document.getElementById("form-title").textContent =
        "Editar chamado";


    mostrarPagina("novo-chamado");

}


// ==========================================
// ALTERAR STATUS
// ==========================================

function alterarStatus(id) {

    const chamado =
        chamados.find(function (item) {
            return item.id === id;
        });


    if (!chamado) return;


    if (chamado.status === "Aberto") {

        chamado.status = "Em andamento";

    } else if (chamado.status === "Em andamento") {

        chamado.status = "Resolvido";

    } else {

        chamado.status = "Aberto";

    }


    salvarDados();

    atualizarDashboard();

    renderizarChamados();

    renderizarRecentes();

}


// ==========================================
// EXCLUIR CHAMADO
// ==========================================

function excluirChamado(id) {

    const confirmar =
        confirm("Tem certeza que deseja excluir este chamado?");


    if (!confirmar) return;


    chamados =
        chamados.filter(function (item) {
            return item.id !== id;
        });


    salvarDados();

    atualizarDashboard();

    renderizarChamados();

    renderizarRecentes();


    alert("Chamado excluído com sucesso!");

}


// ==========================================
// VISUALIZAR CHAMADO
// ==========================================

function visualizarChamado(id) {

    const chamado =
        chamados.find(function (item) {
            return item.id === id;
        });


    if (!chamado) return;


    document.getElementById("modalContent").innerHTML = `

        <div class="modal-detail">
            <strong>Título</strong>
            <p>${escaparHTML(chamado.titulo)}</p>
        </div>

        <div class="modal-detail">
            <strong>Categoria</strong>
            <p>${escaparHTML(chamado.categoria)}</p>
        </div>

        <div class="modal-detail">
            <strong>Descrição</strong>
            <p>${escaparHTML(chamado.descricao)}</p>
        </div>

        <div class="modal-detail">
            <strong>Solicitante</strong>
            <p>${escaparHTML(chamado.solicitante)}</p>
        </div>

        <div class="modal-detail">
            <strong>Prioridade</strong>
            <p>${chamado.prioridade}</p>
        </div>

        <div class="modal-detail">
            <strong>Status</strong>
            <p>${chamado.status}</p>
        </div>

    `;


    document
        .getElementById("modal")
        .classList.add("show");

}


// ==========================================
// FECHAR MODAL
// ==========================================

function fecharModal() {

    document
        .getElementById("modal")
        .classList.remove("show");

}


document
    .getElementById("modal")
    .addEventListener("click", function (event) {

        if (event.target === this) {

            fecharModal();

        }

    });


// ==========================================
// SEGURANÇA BÁSICA
// ==========================================

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}