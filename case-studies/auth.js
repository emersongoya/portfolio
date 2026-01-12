// Constantes
const CORRECT_PASSWORD = 'portfolio2025';
const AUTH_KEY = 'portfolio_authenticated';

// Verificar se está autenticado
function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
}

// Fazer login
function login(password) {
    if (password === CORRECT_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        return true;
    }
    return false;
}

// Fazer logout
function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
}

// Proteger página
function protectPage() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// Redirecionar se já autenticado (para página de login)
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'index.html';
    }
}
