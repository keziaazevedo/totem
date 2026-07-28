// js/epi.js
// Controle de EPIs

const epi = {
    init() {
        this.configurarFormulario();
        this.configurarFiltros();
    },
    
    configurarFormulario() {
        const form = document.getElementById('formEPI');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.registrarEntrega();
            });
        }
    },
    
    configurarFiltros() {
        const filtro = document.getElementById('filtroEPI');
        if (filtro) {
            filtro.addEventListener('input', (e) => {
                this.filtrarEPIs(e.target.value);
            });
        }
    },
    
    registrarEntrega() {
        const funcionario = document.getElementById('funcionario')?.value;
        const epiSelect = document.getElementById('epiSelect')?.value;
        const quantidade = document.getElementById('quantidade')?.value;
        const observacao = document.getElementById('observacao')?.value || '';
        
        if (!funcionario || !epiSelect || !quantidade) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }
        
        const registro = {
            id: Date.now(),
            funcionario: funcionario,
            epi: epiSelect,
            quantidade: parseInt(quantidade),
            observacao: observacao,
            data: new Date().toISOString(),
            assinado: false,
            emergencia: false
        };
        
        // Adicionar ao app
        if (typeof app !== 'undefined') {
            app.adicionarRegistro(registro);
        }
        
        // Limpar formulário
        this.limparFormulario();
        
        // Mostrar mensagem de sucesso
        alert(`✅ Entrega registrada com sucesso!\n\nFuncionário: ${funcionario}\nEPI: ${epiSelect}\nQuantidade: ${quantidade}`);
        
        // Atualizar lista de EPIs
        this.atualizarListaEPIs();
    },
    
    limparFormulario() {
        document.getElementById('funcionario').value = '';
        document.getElementById('epiSelect').value = '';
        document.getElementById('quantidade').value = '';
        document.getElementById('observacao').value = '';
    },
    
    filtrarEPIs(valor) {
        // Implementar filtro se necessário
        console.log('Filtrar por:', valor);
    },
    
    atualizarListaEPIs() {
        const lista = document.getElementById('listaEPIs');
        if (!lista || typeof app === 'undefined') return;
        
        const registros = app.registros;
        if (registros.length === 0) {
            lista.innerHTML = `
                <div class="lista-vazia">
                    <p>Nenhum EPI registrado.</p>
                </div>
            `;
            return;
        }
        
        // Mostrar últimos 10 registros
        const ultimos = registros.slice(-10).reverse();
        let html = '<div class="lista-epis">';
        
        ultimos.forEach(registro => {
            const data = new Date(registro.data).toLocaleDateString('pt-BR');
            const status = registro.assinado ? '✅ Assinado' : '📝 Pendente';
            
            html += `
                <div class="epi-item">
                    <div class="epi-info">
                        <strong>${registro.funcionario}</strong>
                        <span>${registro.epi}</span>
                        <span class="epi-quantidade">${registro.quantidade}x</span>
                    </div>
                    <div class="epi-detalhes">
                        <span class="epi-data">${data}</span>
                        <span class="epi-status ${registro.assinado ? 'status-assinado' : 'status-pendente'}">${status}</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        lista.innerHTML = html;
    }
};

// Inicializar quando a página EPI for mostrada
document.addEventListener('DOMContentLoaded', () => {
    // Será inicializado pelo app
    if (typeof app !== 'undefined' && app.currentPage === 'epi') {
        epi.init();
    }
});