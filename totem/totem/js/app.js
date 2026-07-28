// js/app.js
// Navegação e controle principal do sistema

const app = {
    pages: {
        dashboard: { id: 'dashboard', titulo: 'Dashboard' },
        epi: { id: 'epi', titulo: 'Controle de EPIs' },
        assinatura: { id: 'assinatura', titulo: 'Assinatura Digital' },
        emergencia: { id: 'emergencia', titulo: 'Emergência' },
        historico: { id: 'historico', titulo: 'Histórico' }
    },
    
    currentPage: 'dashboard',
    registros: [],
    
    init() {
        this.configurarMenu();
        this.mostrarPagina('dashboard');
        this.atualizarDashboard();
        this.carregarDados();
        
        // Configurar botão de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Deseja realmente sair?')) {
                    login.logout();
                }
            });
        }
    },
    
    configurarMenu() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const pagina = e.currentTarget.dataset.page;
                if (pagina) {
                    this.mostrarPagina(pagina);
                }
            });
        });
    },
    
    mostrarPagina(pagina) {
        // Esconder todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });
        
        // Mostrar a página selecionada
        const pageElement = document.getElementById(pagina);
        if (pageElement) {
            pageElement.style.display = 'block';
            this.currentPage = pagina;
            
            // Atualizar menu ativo
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === pagina) {
                    item.classList.add('active');
                }
            });
            
            // Atualizar título
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle && this.pages[pagina]) {
                pageTitle.textContent = this.pages[pagina].titulo;
            }
            
            // Atualizar página específica
            if (pagina === 'dashboard') this.atualizarDashboard();
            if (pagina === 'historico') this.atualizarHistorico();
        }
    },
    
    carregarDados() {
        // Carregar registros do localStorage
        const dados = localStorage.getItem('registrosEPI');
        if (dados) {
            this.registros = JSON.parse(dados);
        }
    },
    
    salvarDados() {
        localStorage.setItem('registrosEPI', JSON.stringify(this.registros));
    },
    
    atualizarDashboard() {
        const totalEPIs = document.getElementById('totalEPIs');
        const entregasHoje = document.getElementById('entregasHoje');
        const funcionarios = document.getElementById('funcionarios');
        const ultimaEntrega = document.getElementById('ultimaEntrega');
        
        // Atualizar contadores
        if (totalEPIs) {
            const total = this.registros.length;
            totalEPIs.textContent = total;
        }
        
        if (entregasHoje) {
            const hoje = new Date().toDateString();
            const entregasHojeCount = this.registros.filter(r => {
                const dataRegistro = new Date(r.data).toDateString();
                return dataRegistro === hoje;
            }).length;
            entregasHoje.textContent = entregasHojeCount;
        }
        
        if (funcionarios) {
            const funcionariosUnicos = new Set(this.registros.map(r => r.funcionario));
            funcionarios.textContent = funcionariosUnicos.size;
        }
        
        if (ultimaEntrega && this.registros.length > 0) {
            const ultimo = this.registros[this.registros.length - 1];
            ultimaEntrega.textContent = `${ultimo.funcionario} - ${new Date(ultimo.data).toLocaleDateString('pt-BR')}`;
        }
    },
    
    atualizarHistorico() {
        const listaHistorico = document.getElementById('listaHistorico');
        if (!listaHistorico) return;
        
        if (this.registros.length === 0) {
            listaHistorico.innerHTML = `
                <div class="historico-vazio">
                    <p>Nenhum registro encontrado.</p>
                </div>
            `;
            return;
        }
        
        let html = '<table class="tabela-historico"><thead><tr>';
        html += '<th>Data</th><th>Funcionário</th><th>EPI</th><th>Quantidade</th><th>Status</th></tr></thead><tbody>';
        
        // Ordenar do mais recente para o mais antigo
        const registrosOrdenados = [...this.registros].reverse();
        
        registrosOrdenados.forEach(registro => {
            const data = new Date(registro.data).toLocaleDateString('pt-BR') + ' ' + 
                        new Date(registro.data).toLocaleTimeString('pt-BR');
            const status = registro.assinado ? '✅ Assinado' : '📝 Pendente';
            
            html += `<tr>
                <td>${data}</td>
                <td>${registro.funcionario}</td>
                <td>${registro.epi}</td>
                <td>${registro.quantidade}</td>
                <td class="status-${registro.assinado ? 'assinado' : 'pendente'}">${status}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        listaHistorico.innerHTML = html;
    },
    
    adicionarRegistro(registro) {
        this.registros.push(registro);
        this.salvarDados();
        this.atualizarDashboard();
        this.atualizarHistorico();
    }
};

// Inicializar app apenas se não estiver na tela de login
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se já está logado via localStorage
    const logado = localStorage.getItem('logado');
    if (logado === 'true') {
        app.init();
    }
});