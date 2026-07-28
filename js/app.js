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
        this.configurarLogout();
        this.inicializarAssinatura();
    },

    configurarMenu() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.abrirPagina(page);
                // Fechar menu mobile
                document.querySelector('.menu-lateral').classList.remove('menu-aberto');
            });
        });
    },

    configurarLogout() {
        document.getElementById('btnLogout').addEventListener('click', () => {
            if (confirm('Deseja realmente sair do sistema?')) {
                login.logout();
            }
        });
    },

    inicializarAssinatura() {
        // Inicializar quando a página de entrega for mostrada
        const observer = new MutationObserver(() => {
            const entrega = document.getElementById('entrega');
            if (entrega && entrega.style.display !== 'none') {
                setTimeout(() => {
                    if (typeof assinatura !== 'undefined') {
                        assinatura.init();
                    }
                }, 300);
            }
        });
        
        const sistema = document.getElementById('sistema');
        if (sistema) {
            observer.observe(sistema, { 
                childList: true, 
                subtree: true,
                attributes: true,
                attributeFilter: ['style']
            });
        }
    },

    abrirPagina(pagina) {
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
        
        const pageElement = document.getElementById(pagina);
        if (pageElement) {
            pageElement.style.display = 'block';
        }

        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === pagina) {
                item.classList.add('active');
            }
        });

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
        this.registros = dados ? JSON.parse(dados) : [];
    },

    salvarDados() {
        localStorage.setItem('registrosEPI', JSON.stringify(this.registros));
    },

    mostrarEtapa(etapa) {
        document.querySelectorAll('.etapa-container').forEach(el => {
            el.style.display = 'none';
        });

        const etapaEl = document.getElementById(`etapa${etapa}`);
        if (etapaEl) {
            etapaEl.style.display = 'block';
        }

        document.querySelectorAll('.progress-step').forEach(step => {
            step.classList.remove('active', 'completed');
            const stepNum = parseInt(step.dataset.step);
            if (stepNum === etapa) {
                step.classList.add('active');
            } else if (stepNum < etapa) {
                step.classList.add('completed');
            }
        });

        this.atualizarResumo();
        
        // Inicializar canvas na etapa 3
        if (etapa === 3) {
            setTimeout(() => {
                if (typeof assinatura !== 'undefined') {
                    assinatura.init();
                }
            }, 200);
        }
    },

    atualizarResumo() {
        const funcionario = document.getElementById('nomeFuncionario')?.value || '-';
        const epi = document.getElementById('epiSelect')?.value || '-';
        const quantidade = document.getElementById('quantidade')?.value || '-';
        const responsavel = document.getElementById('responsavelTST')?.value || '-';

        ['resumoFuncionario', 'resumoFuncionario2'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = funcionario;
        });
        
        ['resumoEpi', 'resumoEpi2'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = epi;
        });
        
        const resumoQtd = document.getElementById('resumoQuantidade');
        if (resumoQtd) resumoQtd.textContent = quantidade;
        
        const resumoResp = document.getElementById('resumoResponsavel');
        if (resumoResp) resumoResp.textContent = responsavel;
    },

    irParaEtapa(etapa) {
        if (etapa > this.etapaAtual + 1) {
            alert('Complete a etapa atual primeiro!');
            return;
        }

        if (etapa === 2 && !this.validarEtapa1()) return;
        if (etapa === 3 && !this.validarEtapa2()) return;
        if (etapa === 4 && !this.validarEtapa3()) return;

        this.etapaAtual = etapa;
        this.mostrarEtapa(etapa);

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
        const canvas = document.getElementById('canvasAssinatura');
        if (!canvas) return false;
        
        const dataUrl = canvas.toDataURL();
        // Verifica se tem algo desenhado (não está vazio)
        if (dataUrl.length < 1000) {
            alert('Por favor, realize a assinatura do trabalhador!');
            return false;
        }
        return true;
    },

    finalizarEntrega() {
        const canvas = document.getElementById('canvasAssinatura');
        const assinaturaData = canvas ? canvas.toDataURL() : '';
        
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
            assinatura: assinaturaData,
            assinado: true,
            timestamp: new Date().toISOString()
        };

        this.registros.push(registro);
        this.salvarDados();
        this.mostrarConfirmacao(registro);
        this.atualizarDashboard();
        this.atualizarHistorico();
    },

    mostrarConfirmacao(registro) {
        document.getElementById('confirmFuncionario').textContent = `${registro.funcionario} (${registro.matricula})`;
        document.getElementById('confirmEpi').textContent = registro.epi;
        document.getElementById('confirmQuantidade').textContent = registro.quantidade;
        document.getElementById('confirmResponsavel').textContent = registro.responsavelTST;
        document.getElementById('confirmData').textContent = new Date(registro.data).toLocaleDateString('pt-BR');
    },

    novaEntrega() {
        ['nomeFuncionario', 'matricula', 'funcao', 'observacao', 'responsavelTST', 'registroTST'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        
        const epiSelect = document.getElementById('epiSelect');
        if (epiSelect) epiSelect.value = '';
        
        const quantidade = document.getElementById('quantidade');
        if (quantidade) quantidade.value = '1';
        
        ['confirmacaoTST', 'treinamentoTST'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.checked = false;
        });

        // Limpar assinatura
        const canvas = document.getElementById('canvasAssinatura');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ccc';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Assine aqui', canvas.width / 2, canvas.height / 2);
        }

        this.etapaAtual = 1;
        this.mostrarEtapa(1);
        this.abrirPagina('entrega');
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

function toggleMenu() {
    document.querySelector('.menu-lateral').classList.toggle('menu-aberto');
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('logado') === 'true') {
        app.init();
    }
});