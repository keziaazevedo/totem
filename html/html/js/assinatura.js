// js/assinatura.js
// Assinatura digital com canvas

const assinatura = {
    canvas: null,
    ctx: null,
    desenhando: false,
    ultimoX: 0,
    ultimoY: 0,
    cor: '#000000',
    tamanho: 2,
    
    init() {
        this.canvas = document.getElementById('canvasAssinatura');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.configurarCanvas();
        this.configurarEventos();
        
        // Carregar assinatura salva se existir
        this.carregarAssinatura();
    },
    
    configurarCanvas() {
        if (!this.canvas || !this.ctx) return;
        
        // Ajustar tamanho do canvas
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const width = Math.min(rect.width - 40, 600);
        const height = 200;
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        // Fundo branco
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Borda
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Texto de instrução
        this.ctx.fillStyle = '#999';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Assine aqui', this.canvas.width / 2, this.canvas.height / 2);
    },
    
    configurarEventos() {
        if (!this.canvas) return;
        
        // Eventos de mouse
        this.canvas.addEventListener('mousedown', (e) => this.iniciarDesenho(e));
        this.canvas.addEventListener('mousemove', (e) => this.desenhar(e));
        this.canvas.addEventListener('mouseup', () => this.pararDesenho());
        this.canvas.addEventListener('mouseleave', () => this.pararDesenho());
        
        // Eventos de toque (mobile)
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.pararDesenho();
        });
        
        // Botões
        document.getElementById('limparAssinatura')?.addEventListener('click', () => this.limpar());
        document.getElementById('salvarAssinatura')?.addEventListener('click', () => this.salvar());
    },
    
    iniciarDesenho(e) {
        if (!this.ctx) return;
        
        this.desenhando = true;
        const pos = this.obterPosicao(e);
        this.ultimoX = pos.x;
        this.ultimoY = pos.y;
        
        // Iniciar traço
        this.ctx.beginPath();
        this.ctx.moveTo(this.ultimoX, this.ultimoY);
    },
    
    desenhar(e) {
        if (!this.desenhando || !this.ctx) return;
        
        const pos = this.obterPosicao(e);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.ultimoX, this.ultimoY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.strokeStyle = this.cor;
        this.ctx.lineWidth = this.tamanho;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
        
        this.ultimoX = pos.x;
        this.ultimoY = pos.y;
    },
    
    pararDesenho() {
        this.desenhando = false;
    },
    
    obterPosicao(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y };
    },
    
    limpar() {
        if (!this.ctx || !this.canvas) return;
        
        if (confirm('Deseja realmente limpar a assinatura?')) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Borda
            this.ctx.strokeStyle = '#ddd';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Texto de instrução
            this.ctx.fillStyle = '#999';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('Assine aqui', this.canvas.width / 2, this.canvas.height / 2);
            
            localStorage.removeItem('assinaturaSalva');
        }
    },
    
    salvar() {
        if (!this.canvas) return;
        
        // Verificar se há algo desenhado
        const imageData = this.canvas.toDataURL();
        
        // Salvar no localStorage
        localStorage.setItem('assinaturaSalva', imageData);
        
        // Atualizar último registro com assinatura
        if (typeof app !== 'undefined' && app.registros.length > 0) {
            const ultimoRegistro = app.registros[app.registros.length - 1];
            if (!ultimoRegistro.assinado) {
                ultimoRegistro.assinado = true;
                ultimoRegistro.assinatura = imageData;
                app.salvarDados();
                
                alert('✅ Assinatura salva com sucesso!');
            } else {
                alert('ℹ️ Este registro já foi assinado.');
            }
        } else {
            alert('✅ Assinatura salva com sucesso!');
        }
    },
    
    carregarAssinatura() {
        const assinaturaSalva = localStorage.getItem('assinaturaSalva');
        if (assinaturaSalva && this.ctx && this.canvas) {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            };
            img.src = assinaturaSalva;
        }
    }
};

// Inicializar quando a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar assinatura quando a página for mostrada
    if (document.getElementById('assinatura')) {
        assinatura.init();
    }
});