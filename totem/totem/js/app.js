// js/app.js
const app = {
    registros: [],
    etapaAtual: 1,

    init() {
        this.configurarMenu();
        this.carregarDados();
        this.atualizarDashboard();
        this.atualizarHistorico();
        this.configurarDataPadrao();

        // Logout
        document.getElementById('btnLogout').addEventListener('click', () => {
            login.logout();
        });

        // Menu mobile
        this.configurarMenuMobile();
    },

    configurarMenu() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.abrirPagina(page);
            });
        });
    },

    configurarMenuMobile() {
        // Para responsivo
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '☰';
        menuToggle.onclick = () => {
            document.querySelector('.menu-lateral').classList.toggle('menu-aberto');
        };
        document.querySelector('.conteudo-principal').prepend(menuToggle);
    },

    abrirPagina(pagina) {
        // Esconder todas
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
        
        // Mostrar a selecionada
        const pageElement = document.getElementById(pagina);
        if (pageElement) {
            pageElement.style.display = 'block';
        }

        // Atualizar menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pagina) {
                item.classList.add('active');
            }
        });

        // Atualizar página específica
        if (pagina === 'dashboard') this.atualizarDashboard();
        if (pagina === 'historico') this.atualizarHistorico();
        if (pagina === 'entrega') {
            this.etapaAtual = 1;
            this.mostrarEtapa(1);
        }
    },

    configurarDataPadrao() {
        const dataInput = document.getElementById('dataEntrega');
        if (dataInput) {
            const hoje = new Date().toISOString().split('T')[0];
            dataInput.value = hoje;
        }
    },

    carregarDados() {
        const dados = localStorage.getItem('registrosEPI');
        if (dados) {
            this.registros = JSON.parse(dados);
        } else {
            this.registros = [];
        }
    },

    salvarDados() {
        localStorage.setItem('registrosEPI', JSON.stringify(this.registros));
    },

    mostrarEtapa(etapa) {
        // Esconder todas as etapas
        document.querySelectorAll('.etapa-container').forEach(el => {
            el.style.display = 'none';
        });

        // Mostrar etapa selecionada
        const etapaEl = document.getElementById(`etapa${etapa}`);
        if (etapaEl) {
            etapaEl.style.display = 'block';
        }

        // Atualizar progresso
        document.querySelectorAll('.progress-step').forEach(step => {
            step.classList.remove('active', 'completed');
            const stepNum = parseInt(step.dataset.step);
            if (stepNum === etapa) {
                step.classList.add('active');
            } else if (stepNum < etapa) {
                step.classList.add('completed');
            }
        });

        // Atualizar resumo
        this.atualizarResumo();
    },

    atualizarResumo() {
        const funcionario = document.getElementById('nomeFuncionario')?.value || '-';
        const epi = document.getElementById('epiSelect')?.value || '-';
        const quantidade = document.getElementById('quantidade')?.value || '-';
        const responsavel = document.getElementById('responsavelTST')?.value || '-';

        document.getElementById('resumoFuncionario').textContent = funcionario;
        document.getElementById('resumoEpi').textContent = epi;
        document.getElementById('resumoQuantidade').textContent = quantidade;
        document.getElementById('resumoFuncionario2').textContent = funcionario;
        document.getElementById('resumoEpi2').textContent = epi;
        document.getElementById('resumoResponsavel').textContent = responsavel;
    },

    irParaEtapa(etapa) {
        // Validar etapa atual antes de avançar
        if (etapa > this.etapaAtual + 1) {
            alert('Complete a etapa atual primeiro!');
            return;
        }

        if (etapa === 2 && !this.validarEtapa1()) return;
        if (etapa === 3 && !this.validarEtapa2()) return;
        if (etapa === 4 && !this.validarEtapa3()) return;

        this.etapaAtual = etapa;
        this.mostrarEtapa(etapa);

        // Se for etapa 4, finalizar entrega
        if (etapa === 4) {
            this.finalizarEntrega();
        }
    },

    validarEtapa1() {
        const nome = document.getElementById('nomeFuncionario').value.trim();
        const matricula = document.getElementById('matricula').value.trim();
        const epi = document.getElementById('epiSelect').value;

        if (!nome) {
            alert('Por favor, informe o nome do funcionário!');
            document.getElementById('nomeFuncionario').focus();
            return false;
        }

        if (!matricula) {
            alert('Por favor, informe a matrícula do funcionário!');
            document.getElementById('matricula').focus();
            return false;
        }

        if (!epi) {
            alert('Por favor, selecione um EPI!');
            document.getElementById('epiSelect').focus();
            return false;
        }

        return true;
    },

    validarEtapa2() {
        const responsavel = document.getElementById('responsavelTST').value.trim();
        const confirmacao = document.getElementById('confirmacaoTST').checked;
        const treinamento = document.getElementById('treinamentoTST').checked;

        if (!responsavel) {
            alert('Por favor, informe o responsável do TST!');
            document.getElementById('responsavelTST').focus();
            return false;
        }

        if (!confirmacao) {
            alert('Por favor, confirme a entrega do EPI!');
            return false;
        }

        if (!treinamento) {
            alert('Por favor, confirme que o funcionário foi orientado!');
            return false;
        }

        return true;
    },

    validarEtapa3() {
        const assinatura = localStorage.getItem('assinaturaSalva');
        if (!assinatura) {
            alert('Por favor, realize a assinatura do trabalhador!');
            return false;
        }
        return true;
    },

    finalizarEntrega() {
        const registro = {
            id: Date.now(),
            data: document.getElementById('dataEntrega').value || new Date().toISOString().split('T')[0],
            funcionario: document.getElementById('nomeFuncionario').value.trim(),
            matricula: document.getElementById('matricula').value.trim(),
            funcao: document.getElementById('funcao').value.trim(),
            epi: document.getElementById('epiSelect').value,
            quantidade: parseInt(document.getElementById('quantidade').value) || 1,
            observacao: document.getElementById('observacao').value.trim(),
            responsavelTST: document.getElementById('responsavelTST').value.trim(),
            registroTST: document.getElementById('registroTST').value.trim(),
            assinatura: localStorage.getItem('assinaturaSalva'),
            assinado: true,
            timestamp: new Date().toISOString()
        };

        // Salvar
        this.registros.push(registro);
        this.salvarDados();

        // Mostrar confirmação
        this.mostrarConfirmacao(registro);

        // Limpar assinatura
        localStorage.removeItem('assinaturaSalva');
    },

    mostrarConfirmacao(registro) {
        document.getElementById('confirmFuncionario').textContent = `${registro.funcionario} (${registro.matricula})`;
        document.getElementById('confirmEpi').textContent = registro.epi;
        document.getElementById('confirmQuantidade').textContent = registro.quantidade;
        document.getElementById('confirmResponsavel').textContent = registro.responsavelTST;
        document.getElementById('confirmData').textContent = new Date(registro.data).toLocaleDateString('pt-BR');

        // Atualizar dashboard
        this.atualizarDashboard();
        this.atualizarHistorico();
    },

    novaEntrega() {
        // Limpar formulário
        document.getElementById('nomeFuncionario').value = '';
        document.getElementById('matricula').value = '';
        document.getElementById('funcao').value = '';
        document.getElementById('epiSelect').value = '';
        document.getElementById('quantidade').value = '1';
        document.getElementById('observacao').value = '';
        document.getElementById('responsavelTST').value = '';
        document.getElementById('registroTST').value = '';
        document.getElementById('confirmacaoTST').checked = false;
        document.getElementById('treinamentoTST').checked = false;
        document.getElementById('canvasAssinatura').getContext('2d').clearRect(0, 0, 600, 200);

        // Voltar para etapa 1
        this.etapaAtual = 1;
        this.mostrarEtapa(1);
    },

    atualizarDashboard() {
        const total = this.registros.length;
        const funcionarios = new Set(this.registros.map(r => r.matricula)).size;
        const assinaturas = this.registros.filter(r => r.assinado).length;
        const emergencias = JSON.parse(localStorage.getItem('emergencias') || '[]').length;

        document.getElementById('totalEntregas').textContent = total;
        document.getElementById('totalFuncionarios').textContent = funcionarios;
        document.getElementById('totalAssinaturas').textContent = assinaturas;
        document.getElementById('totalEmergencias').textContent = emergencias;

        // Últimas entregas
        const container = document.getElementById('ultimasEntregas');
        const ultimas = this.registros.slice(-5).reverse();

        if (ultimas.length === 0) {
            container.innerHTML = '<p class="sem-registros">Nenhuma entrega registrada ainda.</p>';
        } else {
            container.innerHTML = ultimas.map(r => `
                <div class="entrega-item">
                    <div class="entrega-info">
                        <strong>${r.funcionario}</strong>
                        <span>${r.epi}</span>
                        <span class="entrega-qtd">${r.quantidade}x</span>
                    </div>
                    <div class="entrega-meta">
                        <span>${new Date(r.data).toLocaleDateString('pt-BR')}</span>
                        <span class="status-assinado">✅ Assinado</span>
                    </div>
                </div>
            `).join('');
        }
    },

    atualizarHistorico() {
        const tbody = document.getElementById('listaHistorico');
        if (this.registros.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="sem-registros">Nenhum registro encontrado.</td></tr>';
            return;
        }

        const registrosOrdenados = [...this.registros].reverse();
        tbody.innerHTML = registrosOrdenados.map(r => `
            <tr>
                <td>${new Date(r.data).toLocaleDateString('pt-BR')}</td>
                <td><strong>${r.funcionario}</strong></td>
                <td>${r.matricula}</td>
                <td>${r.epi}</td>
                <td>${r.quantidade}</td>
                <td>${r.responsavelTST}</td>
                <td>${r.assinado ? '✅ Assinado' : '❌ Pendente'}</td>
                <td><span class="status-confirmado">CONFIRMADO</span></td>
            </tr>
        `).join('');
    }
};

// Funções globais
function abrirPagina(pagina) {
    if (typeof app !== 'undefined') {
        app.abrirPagina(pagina);
    }
}

function irParaEtapa(etapa) {
    if (typeof app !== 'undefined') {
        app.irParaEtapa(etapa);
    }
}

function novaEntrega() {
    if (typeof app !== 'undefined') {
        app.novaEntrega();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('logado') === 'true') {
        app.init();
    }
});