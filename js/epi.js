// js/epi.js - Integrado com o novo sistema
// As funções principais agora estão em app.js

// Função para registrar entrega (chamada pelo botão de registrar)
function registrarEntrega() {
    if (typeof app !== 'undefined') {
        // Se o usuário estiver na página de entrega, vai para a etapa 1
        const entregaPage = document.getElementById('entrega');
        if (entregaPage && entregaPage.style.display !== 'none') {
            // Já está na página de entrega
            app.irParaEtapa(1);
        } else {
            // Abrir página de entrega
            app.abrirPagina('entrega');
        }
    } else {
        alert('Sistema não inicializado. Faça login novamente.');
    }
}

// Exportar CSV
function exportarCSV() {
    if (typeof app !== 'undefined') {
        const registros = app.registros;
        if (registros.length === 0) {
            alert('Não há registros para exportar.');
            return;
        }

        let csv = 'Data,Funcionário,Matrícula,Função,EPI,Quantidade,Responsável TST,Status\n';
        registros.forEach(r => {
            csv += `${r.data},${r.funcionario},${r.matricula},${r.funcao || '-'},${r.epi},${r.quantidade},${r.responsavelTST},${r.assinado ? 'ASSINADO' : 'PENDENTE'}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `entregas_epi_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}