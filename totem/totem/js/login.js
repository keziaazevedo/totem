// js/login.js
const login = {
    usuarioPadrao: 'seguranca',
    senhaPadrao: '123456',

    init() {
        const btnLogin = document.getElementById('btnLogin');
        if (btnLogin) {
            btnLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.fazerLogin();
            });
        }

        // Enter para login
        const senhaInput = document.getElementById('senha');
        if (senhaInput) {
            senhaInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.fazerLogin();
                }
            });
        }

        this.verificarSessao();
    },

    verificarSessao() {
        const logado = localStorage.getItem('logado');
        if (logado === 'true') {
            this.mostrarSistema();
        }
    },

    fazerLogin() {
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        const mensagemErro = document.getElementById('mensagemErro');

        if (usuario === this.usuarioPadrao && senha === this.senhaPadrao) {
            localStorage.setItem('logado', 'true');
            localStorage.setItem('usuario', usuario);
            this.mostrarSistema();
        } else {
            mensagemErro.textContent = '❌ Usuário ou senha incorretos! Tente novamente.';
            mensagemErro.style.display = 'block';
            setTimeout(() => {
                mensagemErro.style.display = 'none';
            }, 4000);
        }
    },

    mostrarSistema() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('sistema').style.display = 'flex';
        document.getElementById('usuarioLogado').textContent = localStorage.getItem('usuario');
        
        if (typeof app !== 'undefined') {
            app.init();
        }
    },

    logout() {
        if (confirm('Deseja realmente sair do sistema?')) {
            localStorage.removeItem('logado');
            localStorage.removeItem('usuario');
            document.getElementById('loginScreen').style.display = 'flex';
            document.getElementById('sistema').style.display = 'none';
            
            document.getElementById('usuario').value = '';
            document.getElementById('senha').value = '';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    login.init();
});