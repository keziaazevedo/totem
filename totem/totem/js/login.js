// js/login.js
// Sistema de login com usuário demo

const login = {
    usuarioPadrao: 'admin',
    senhaPadrao: '123456',

    init() {
        this.configurarEventos();
        this.verificarSessao();
    },

    configurarEventos() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.fazerLogin();
            });
        }
    },

    verificarSessao() {
        // Verifica se já está logado
        const logado = localStorage.getItem('logado');
        if (logado === 'true') {
            this.mostrarSistema();
        }
    },

    fazerLogin() {
        const usuario = document.getElementById('usuario')?.value || '';
        const senha = document.getElementById('senha')?.value || '';
        const mensagem = document.getElementById('mensagemErro');

        if (usuario === this.usuarioPadrao && senha === this.senhaPadrao) {
            localStorage.setItem('logado', 'true');
            localStorage.setItem('usuario', usuario);
            this.mostrarSistema();
        } else {
            if (mensagem) {
                mensagem.textContent = '❌ Usuário ou senha incorretos!';
                mensagem.style.display = 'block';
                setTimeout(() => {
                    mensagem.style.display = 'none';
                }, 3000);
            }
            alert('Usuário ou senha incorretos!\n\nDica: admin / 123456');
        }
    },

    mostrarSistema() {
        const loginScreen = document.getElementById('loginScreen');
        const sistema = document.getElementById('sistema');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (sistema) {
            sistema.style.display = 'flex';
            // Inicializa o sistema após mostrar
            if (typeof app !== 'undefined' && app.init) {
                app.init();
            }
        }
    },

    logout() {
        localStorage.removeItem('logado');
        localStorage.removeItem('usuario');
        const loginScreen = document.getElementById('loginScreen');
        const sistema = document.getElementById('sistema');
        
        if (loginScreen) loginScreen.style.display = 'flex';
        if (sistema) sistema.style.display = 'none';
        
        // Limpar campos
        const usuario = document.getElementById('usuario');
        const senha = document.getElementById('senha');
        if (usuario) usuario.value = '';
        if (senha) senha.value = '';
    }
};

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    login.init();
});