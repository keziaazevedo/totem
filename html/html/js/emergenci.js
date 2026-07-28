// js/emergencia.js
// Sistema de emergência com sirene

const emergencia = {
    audio: null,
    tocando: false,
    
    init() {
        this.configurarBotao();
        this.carregarAudio();
    },
    
    configurarBotao() {
        const btn = document.getElementById('btnEmergencia');
        if (btn) {
            btn.addEventListener('click', () => {
                this.acionarEmergencia();
            });
        }
    },
    
    carregarAudio() {
        try {
            this.audio = new Audio('../sirene.mp3');
            this.audio.loop = true;
            this.audio.volume = 0.8;
        } catch (error) {
            console.error('Erro ao carregar áudio:', error);
        }
    },
    
    acionarEmergencia() {
        if (this.tocando) {
            this.pararEmergencia();
            return;
        }
        
        // Confirmar ação
        if (!confirm('🚨 ATENÇÃO! Isso acionará a sirene de emergência.\nDeseja continuar?')) {
            return;
        }
        
        this.tocando = true;
        
        // Tocar sirene
        if (this.audio) {
            try {
                this.audio.play().catch(error => {
                    console.error('Erro ao reproduzir áudio:', error);
                    alert('Não foi possível reproduzir a sirene. Verifique o arquivo sirene.mp3');
                });
            } catch (error) {
                console.error('Erro ao reproduzir áudio:', error);
            }
        } else {
            alert('Arquivo de áudio não encontrado.');
        }
        
        // Mudar aparência do botão
        const btn = document.getElementById('btnEmergencia');
        if (btn) {
            btn.textContent = '🔴 PARAR EMERGÊNCIA';
            btn.classList.add('emergencia-ativa');
        }
        
        // Registrar ocorrência
        this.registrarOcorrencia();
        
        // Notificar
        alert('🚨 EMERGÊNCIA ATIVADA!\nA sirene está tocando.');
    },
    
    pararEmergencia() {
        if (!this.tocando) return;
        
        this.tocando = false;
        
        // Parar áudio
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        
        // Restaurar botão
        const btn = document.getElementById('btnEmergencia');
        if (btn) {
            btn.textContent = '🆘 EMERGÊNCIA';
            btn.classList.remove('emergencia-ativa');
        }
        
        alert('✅ Emergência desativada.');
    },
    
    registrarOcorrencia() {
        const ocorrencia = {
            id: Date.now(),
            tipo: 'emergencia',
            data: new Date().toISOString(),
            mensagem: '🚨 Emergência acionada',
            usuario: localStorage.getItem('usuario') || 'admin'
        };
        
        // Salvar no histórico de emergências
        const emergencias = JSON.parse(localStorage.getItem('emergencias') || '[]');
        emergencias.push(ocorrencia);
        localStorage.setItem('emergencias', JSON.stringify(emergencias));
        
        // Adicionar como registro no app
        if (typeof app !== 'undefined') {
            const registro = {
                id: Date.now(),
                funcionario: 'SISTEMA',
                epi: 'EMERGÊNCIA',
                quantidade: 0,
                observacao: 'Emergência acionada pelo sistema',
                data: new Date().toISOString(),
                assinado: false,
                emergencia: true
            };
            app.adicionarRegistro(registro);
        }
        
        // Atualizar histórico se estiver visível
        if (typeof app !== 'undefined' && app.currentPage === 'historico') {
            app.atualizarHistorico();
        }
    }
};

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    emergencia.init();
});