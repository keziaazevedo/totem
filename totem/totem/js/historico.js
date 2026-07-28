// js/historico.js
const historico = {
    init() {
        this.configurarFiltro();
    },

    configurarFiltro() {
        const filtro = document.getElementById('filtroHistorico');
        if (filtro) {
            filtro.addEventListener('input', () => {
                this.filtrarHistorico(filtro.value);
            });
        }
    },

    filtrarHistorico(valor) {
        const linhas = document.querySelectorAll('.tabela-historico tbody tr');
        const termo = valor.toLowerCase().trim();

        linhas.forEach(linha => {
            if (linha.classList.contains('sem-registros')) return;
            const texto = linha.textContent.toLowerCase();
            linha.style.display = texto.includes(termo) ? '' : 'none';
        });
    },

    exportarCSV() {
        if (typeof app !== 'undefined' && app.registros.length > 0) {
            let csv = 'Data,Funcionário,Matrícula,Função,EPI,Quantidade,Responsável TST,Status\n';
            app.registros.forEach(r => {
                csv += `${r.data},${r.funcionario},${r.matricula},${r.funcao || '-'},${r.epi},${r.quantidade},${r.responsavelTST},${r.assinado ? 'ASSINADO' : 'PENDENTE'}\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `historico_epi_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('Não há registros para exportar.');
        }
    }
};

function exportarCSV() {
    historico.exportarCSV();
}

document.addEventListener('DOMContentLoaded', () => {
    historico.init();
});