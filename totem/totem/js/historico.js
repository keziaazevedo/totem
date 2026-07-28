// js/historico.js
// Visualização do histórico

const historico = {
    init() {
        this.atualizarHistorico();
        this.configurarFiltros();
    },
    
    atualizarHistorico() {
        const container = document.getElementById('listaHistorico');
        if (!container) return;
        
        // Buscar dados do app
        const registros = typeof app !== 'undefined' ? app.registros : [];
        
        if (registros.length === 0) {
            container.innerHTML = `
                <div class="historico-vazio">
                    <p>📋 Nenhum registro encontrado.</p>
                    <p style="font-size: 14px; color: #999; margin-top: 10px;">
                        Comece registrando entregas de EPIs.
                    </p>
                </div>
            `;
            return;
        }
        
        // Ordenar do mais recente para o mais antigo
        const ordenados = [...registros].reverse();
        
        let html = `
            <div class="historico-header">
                <span>Total de registros: <strong>${registros.length}</strong></span>
                <button onclick="historico.exportarCSV()" class="btn-exportar">
                    📊 Exportar CSV
                </button>
            </div>
            <div class="tabela-wrapper">
                <table class="tabela-historico">
                    <thead>
                        <tr>
                            <th>Data/Hora</th>
                            <th>Funcionário</th>
                            <th>EPI</th>
                            <th>Qtd</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        ordenados.forEach(registro => {
            const data = new Date(registro.data);
            const dataFormatada = data.toLocaleDateString('pt-BR');
            const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            
            let status = '';
            let classeStatus = '';
            
            if (registro.emergencia) {
                status = '🚨 EMERGÊNCIA';
                classeStatus = 'status-emergencia';
            } else if (registro.assinado) {
                status = '✅ Assinado';
                classeStatus = 'status-assinado';
            } else {
                status = '📝 Pendente';
                classeStatus = 'status-pendente';
            }
            
            html += `
                <tr>
                    <td>${dataFormatada} ${horaFormatada}</td>
                    <td>${registro.funcionario}</td>
                    <td>${registro.epi}</td>
                    <td>${registro.quantidade}</td>
                    <td class="${classeStatus}">${status}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    configurarFiltros() {
        const filtro = document.getElementById('filtroHistorico');
        if (filtro) {
            filtro.addEventListener('input', (e) => {
                this.filtrarHistorico(e.target.value);
            });
        }
    },
    
    filtrarHistorico(valor) {
        const linhas = document.querySelectorAll('.tabela-historico tbody tr');
        const termo = valor.toLowerCase();
        
        linhas.forEach(linha => {
            const texto = linha.textContent.toLowerCase();
            linha.style.display = texto.includes(termo) ? '' : 'none';
        });
    },
    
    exportarCSV() {
        const registros = typeof app !== 'undefined' ? app.registros : [];
        
        if (registros.length === 0) {
            alert('Não há registros para exportar.');
            return;
        }
        
        // Criar cabeçalho CSV
        let csv = 'Data,Funcionário,EPI,Quantidade,Status,Observação\n';
        
        registros.forEach(registro => {
            const data = new Date(registro.data).toLocaleDateString('pt-BR') + ' ' + 
                        new Date(registro.data).toLocaleTimeString('pt-BR');
            const status = registro.emergencia ? 'EMERGÊNCIA' : 
                          (registro.assinado ? 'ASSINADO' : 'PENDENTE');
            
            csv += `"${data}","${registro.funcionario}","${registro.epi}",${registro.quantidade},"${status}","${registro.observacao || ''}"\n`;
        });
        
        // Baixar arquivo
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `historico_epi_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

// Inicializar quando a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar quando a página histórica for mostrada
    if (document.getElementById('historico')) {
        historico.init();
    }
});